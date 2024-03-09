import express from "express";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from 'cors';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/save_wishlist", async (req, res) => {
    const { email, name, phoneNumber, organisationName, practiceArea, anotherTool, nameOfTool } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1jHms_Sph7avLA02T0CPqeA6a3tFCLw7QKK_bIBuIdhA";

    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1!A:A",
    });

    googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:G",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[email, name, phoneNumber, organisationName, practiceArea, anotherTool, nameOfTool]],
        },
    });

    res.send("Successfully submitted! Thank you!");
});

app.listen(PORT, (req, res) => console.log(`Server started on PORT: ${PORT}`));