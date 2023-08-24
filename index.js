const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const app = express().use(body_parser.json());

const WHATSAPP_TOKEN = "EAARnOK2w6woBOwqxrD2kVSnSWOjCOWqOdNo8cq1HzwouDPgwS4ixoe4glEcfzlZAg9Nmpn83RHzE5ugHxDBxtwxGrZACCCPbimDRargZA9AOsnBd99OYpkM4V3nZBWUQgJkjnjPZC12F8BbGZAPvFcSsxceSVJMiCGWCKpPwEZCSYbIy9pmPNQ4ZAJzXNRZCO5o6m4boIMHTje8Laep4J6ZCdOsOTxvUoZD";
const VERIFY_TOKEN = "anyaaforger";

app.listen(5000 || process.env.PORT, () =>{
    console.log("Jalannn...");
});

app.get("/webhook", (req,res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    // console.log(challenge);
    
    if(mode && token){
        if(mode === "subscribe" && token === VERIFY_TOKEN){
            res.status(200).send(challenge);
            console.log("Webhook Verified");
        }else{
            res.status(403);
            console.log("Webhook not Verified");
        }
    }
});

app.post("/webhook", (req, res)=>{
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if(body_param.object){
        console.log("Inside body param...");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]){
                let phone_no_id = req.body.entry[0].changes[0].value.metadata.phone_no_id;
                let from = req.body.entry[0].changes[0].value.messages[0].from;
                let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;

                console.log("Phone number: " + phone_no_id);
                console.log("From: " + from);
                console.log("Body param: " + msg_body);

                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v17.0/" + phone_no_id + "/messages?access_token=" + WHATSAPP_TOKEN,
                    data:{
                        messaging_product:"whatsapp",
                        to: from,
                        text:{
                            body:"HELLOOOOO!!!!!!"
                        }
                    },
                    headers:{
                        "Content-Type": "application/json"
                    }
                });

                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }
})

app.get("/", (req, res)=>{
    res.status(200).send("This is webhook.");
});