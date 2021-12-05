import { ENDPOINT_URL } from '../resources/definitions'

export type PayloadSchema = {
    status: number,
    message: string,
    data: {
        next_to_go_ids: Array<string>
        race_summaries: any
    }
}

/** Performs a Get call to the api.
 * @param endpoint The endpoint Url
 * @returns Api Payload cast as PayloadSchema
 */
export default async function GetApiPayload(endpoint = ENDPOINT_URL) {
    try {
        let response = await fetch(
            endpoint,
        );
        let jsonResponse = await response.json() as PayloadSchema;

        return (jsonResponse)

    } catch (error) {
        console.error(error);
        throw error
    }
}
