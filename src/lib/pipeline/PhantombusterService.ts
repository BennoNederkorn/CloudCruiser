import { IScraperProvider } from './types';

export class PhantombusterService implements IScraperProvider {
    private apiKey: string;
    private baseUrl = 'https://api.phantombuster.com/api/v2';
    private workspaceId = '7529616959437710';
    private linkedInAgentId = '6160568983087454';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async scrape(profileUrl: string): Promise<any> {
        console.log(`Phantombuster: Scraping ${profileUrl}...`);

        const launchResponse = await this.launchAgent(profileUrl);
        const containerId = launchResponse.containerId;

        console.log(`Phantombuster: Launched agent, container ID: ${containerId}`);

        await this.waitForCompletion(containerId);

        const results = await this.fetchResults(containerId);

        console.log(`Phantombuster: Scraping complete for ${profileUrl}`);
        return results;
    }

    private async launchAgent(profileUrl: string): Promise<any> {
        const argument = {
            numberOfProfilesPerLaunch: 1,
            saveImg: false,
            takeScreenshot: false,
            spreadsheetUrl: profileUrl,
            identities: [
                {
                    identityId: "2217361026503532",
                    sessionCookie: "AQEFARABAAAAABoaoNMAAAGagpe3PgAAAZqmpGNXTgAAs3VybjpsaTplbnRlcnByaXNlQXV0aFRva2VuOmVKeGpaQUFDV1RhOVZTQmEyWC9wR1JDdFpudnBFeU9JVVpFOStUMllFYk4yb2pJREl3QzBhUWtzXnVybjpsaTplbnRlcnByaXNlUHJvZmlsZToodXJuOmxpOmVudGVycHJpc2VBY2NvdW50OjQ4Njk0NDQyNiw1OTI0MjIzNDgpXnVybjpsaTptZW1iZXI6OTM5NzI3MjgwH79LyzX3vP5jo41Isp9IRL6rCrgAN9zaCItvGaCDtUrLoL5ED5p33gcFqoubTBU3PNApvDCSzC0wnEhnZXfb6shspIEQ-I8slrVtEX2ZBhTpq4JOmkq_s4WgoNjne14sKxEuExfKX8g7ckA8hKXmdgEmULbhrfyyE9othD2A61v5F5kJTUy-AUxpGBarL42mNTK0tQ",
                    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
                }
            ],
            emailChooser: "none"
        };

        const response = await fetch(`${this.baseUrl}/agents/launch`, {
            method: 'POST',
            headers: {
                'X-Phantombuster-Key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.linkedInAgentId,
                argument: argument
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Phantombuster launch failed: ${response.statusText} - ${errText}`);
        }

        return response.json();
    }

    private async waitForCompletion(containerId: string): Promise<void> {
        let status = 'running';
        let attempts = 0;
        const maxAttempts = 60;

        while (status === 'running' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000));

            const response = await fetch(`${this.baseUrl}/containers/fetch?id=${containerId}`, {
                headers: {
                    'X-Phantombuster-Key': this.apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch container status: ${response.statusText}`);
            }

            const data = await response.json();
            status = data.status;
            attempts++;

            console.log(`Phantombuster: Container status: ${status} (attempt ${attempts}/${maxAttempts})`);
        }

        if (status === 'running') {
            throw new Error('Phantombuster agent timed out');
        }

        if (status !== 'finished') {
            throw new Error(`Phantombuster agent failed with status: ${status}`);
        }
    }

    private async fetchResults(containerId: string): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const agentResponse = await fetch(`${this.baseUrl}/agents/fetch?id=${this.linkedInAgentId}`, {
            headers: {
                'X-Phantombuster-Key': this.apiKey
            }
        });

        if (!agentResponse.ok) {
            throw new Error(`Failed to fetch agent info: ${agentResponse.statusText}`);
        }

        const agentData = await agentResponse.json();
        console.log(`Phantombuster: Agent data:`, JSON.stringify(agentData, null, 2));

        const s3Folder = agentData.s3Folder;
        const orgS3Folder = agentData.orgS3Folder;

        if (!s3Folder || !orgS3Folder) {
            console.warn('Phantombuster: No S3 folder information found');
            return null;
        }

        const resultFileName = 'result';
        const jsonUrl = `https://phantombuster.s3.amazonaws.com/${orgS3Folder}/${s3Folder}/${resultFileName}.json`;

        console.log(`Phantombuster: Fetching results from: ${jsonUrl}`);

        try {
            const resultsResponse = await fetch(jsonUrl);
            if (resultsResponse.ok) {
                const data = await resultsResponse.json();
                console.log(`Phantombuster: Successfully fetched ${Array.isArray(data) ? data.length : 'unknown'} results`);
                return data;
            } else {
                console.warn(`Phantombuster: Failed to fetch from ${jsonUrl}, status: ${resultsResponse.status}`);

                const altJsonUrl = `https://phantombuster.s3.amazonaws.com/${orgS3Folder}/${s3Folder}/database.json`;
                console.log(`Phantombuster: Trying alternative: ${altJsonUrl}`);

                const altResponse = await fetch(altJsonUrl);
                if (altResponse.ok) {
                    const data = await altResponse.json();
                    console.log(`Phantombuster: Successfully fetched from alternative URL`);
                    return data;
                }
            }
        } catch (e) {
            console.error('Phantombuster: Error fetching results:', e);
        }

        console.warn('Phantombuster: No results found');
        return null;
    }
}
