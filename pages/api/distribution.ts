import { ResponseData } from "@/types";
import { filesTable, tokensTable } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData | string>
) {
    if (req.method === 'POST') {
        const { data } = req.body;
        if (!data) return res.status(400).end("data is missing!");
        if (!data.assignedArea) return res.status(400).end("data is missing!");

        const finalData: any[] = [];
        await filesTable.select({
            view: "Grid view",
            filterByFormula: `OR(${data.assignedArea.map((id:string) => `{subsector} = '${id}'`).join(',')})`
        }).eachPage(function page(records, fetchNextPage) {

            records.forEach(function (record) {
                finalData.push({ ...record.fields, id: record.id });
            });

            fetchNextPage();

        }, function done(err) {
            if (err) {
                return res.status(500).send("Error in fetching data!")
            }
            return res.status(200).send({ data: finalData })
        });

    } else if (req.method === 'PUT') {
        const { data } = req.body;
        if (!data) return res.status(400).end("data is missing!");
        if (!data.id) return res.status(400).end("data is missing!");
        if (!data.fields) return res.status(400).end("data is missing!");

        await filesTable.update([{
            id: data.id,
            fields: data.fields
        }], function (error: any) {
            if (error) {
                return res.status(500).send("Something went wrong updating tokens")
            }
            return res.status(200).send({ data: "Tokens Updated Successfully!" })
        })

    } else {
        return res.status(404).end("API not found")
    }
}

