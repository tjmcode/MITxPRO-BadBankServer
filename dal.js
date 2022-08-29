// <copyright file="index.js" company="MicroCODE Incorporated">Copyright © 2021 MicroCODE Incorporated Troy, MI</copyright><author>Timothy J. McGuire</author>

/*
 *      Title:    Bad Bank SERVER DAL
 *      Module:   index (badbank:index.js)
 *      Project:  MicroCODE Version of MIT 'Bad Bank'
 *      Customer: Internal
 *      Creator:  MicroCODE Incorporated
 *      Date:     August 2022
 *      Author:   Timothy J McGuire
 *
 *      Designed and Coded: 2021,2022 MicroCODE Incorporated
 *
 *      This software and related materials are the property of
 *      MicroCODE Incorporated and contain confidential and proprietary
 *      information. This software and related materials shall not be
 *      duplicated, disclosed to others, or used in any way without the
 *      written of MicroCODE Incorported.
 *
 *
 *      DESCRIPTION:
 *      ------------
 *
 *      This module implements the MicroCODE JavaScript Class for 'dal'
 *      a Data Abstraction Layer (DAL) between our App and the MongoDB.
 *
 *      This implements the Server-side, the 'BACK END'.
 *
 *
 *      REFERENCES:
 *      -----------
 *
 *      1. Starter Code Repository (Front end and API)
 *         https://github.com/1125f16/badbank
 *      2. Starter Code Repository (Simple database)
 *         https://github.com/1125f16/littledb
 *         This is a repository that will get you familiar with the process of storing data with the lowdb package.
 *
 *
 *      VIDEOS:
 *      -------
 *
 *      1. Three Tiers - HTTP Server (Links to an external site.)
 *         https://youtu.be/TL9GyGWqjp4
 *      2. Three Tiers - Data Store (Links to an external site.)
 *         https://youtu.be/yM8nFgkeD-c
 *      3. Three Tiers - HTTP Server + Data Store (Links to an external site.)
 *         https://youtu.be/E9VJ2de654M
 *      4. Three Tiers - HTTP Server + Data Store + HTML Client
 *         https://youtu.be/vcXdW4V8GNs
 *
 *
 *
 *      MODIFICATIONS:
 *      --------------
 *
 *  Date:         By-Group:   Rev:     Description:
 *
 *  25-Aug-2022   TJM-MCODE  {0002}    New module to move React App to MERN Architecture.
 *
 *
 */
"use strict";

// NOTE: Build as CommonJS Module for NodeJS Version v16.7.0

// Include our common MicroCODE Server Library
var mcode = require('./mcodeServer.js');  // CommonJS (CJS) Form: var mcode = require('./mcodeServer.js');

/*
 * SERVER: DATA ABSTRACTION LAYER (DAL)
 * ------------------------------------
 * These define the Server's interface to the Data Store, in this case MongoDB.
 *
 */

const {resolve} = require('path');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = `MITxPRO-BadBank`;

var db = null;

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client)
{
    db = client.db(dbName);

    console.log(`Connected to Mongo DB Server, using database: ${db.databaseName}`);
});


/**
 * createAccount() – Create a new Account with an initial deposit.
 *
 * @api public
 *
 * @param {string} name User's full name - DISPLAY ONLY.
 * @param {string} email User's email account - UNIQUE KEY.
 * @param {float} deposit Initial funds for account - FLOATING POINT.
 * @returns JSON data for Account.
 *
 * @example
 *
 *      createAccount('Peter Parker', 'pparker@mit.edu', 100.00);
 *
 */
function createAccount(name, email, password, deposit)
{
    return new Promise((resolve, reject) =>
    {
        // the name passed becomes the MongoDB Field Name
        var balance = deposit;

        // create JSON describing new User
        var jsonDoc = {name, email, password, balance};

        // add the new User to the collection
        db.collection('Accounts')
            .insertOne(jsonDoc, {w: 1}, function (err, result)
            {
                err ? reject(err) : resolve(jsonDoc);
            });
    });
};

/**
 * depositFunds() – Deposit funds into Account.
 *
 * @api public
 *
 * @param {string} email User's email account - UNIQUE KEY.
 * @param {float} amount New funds for account - FLOATING POINT.
 * @returns JSON data for Account.
 *
 * @example
 *
 *      depositFunds('pparker@mit.edu', 100.00);
 *
 */
function depositFunds(email, amount)
{
    return new Promise(async (resolve, reject) =>
    {
        // grab current users from DB
        var account = await db
            .collection('Accounts')
            .findOne({email: email});

        if (account)
        {
            console.log(`Depositing ${amount} into ${account.name} account.`);

            account.balance += parseFloat(amount);
            account.balance = mcode.roundToCents(account.balance);
            //~ account.transactions.push(createTransaction("DEPOSIT", amount, account.balance));

            db.collection('Accounts')
                .updateOne({email: email}, {$set: {balance: mcode.roundToCents(account.balance)}}, {w: 1}, function (err, result)
                {
                    err ? reject(err) : resolve(account);
                });
        }
        else
        {
            const errorMsg = "Deposit Funds FAILED, no Account for email: " + req.params.email;
            console.log(errorMsg);
            res.status(401).json({error: errorMsg});
        }
    });
};


/**
 * withdrawFunds() – Withdraw funds from Account.
 *
 * @api public
 *
 * @param {string} email User's email account - UNIQUE KEY.
 * @param {float} amount Funds taken from account - FLOATING POINT.
 * @returns JSON data for Account.
 *
 * @example
 *
 *      withdrawFunds('pparker@mit.edu', 100.00);
 *
 */
function withdrawFunds(email, amount)
{
    return new Promise(async (resolve, reject) =>
    {
        // grab current users from DB
        var account = await db
            .collection('Accounts')
            .findOne({email: email});

        if (account)
        {
            console.log(`Withdrawing ${amount} from ${account.name} account.`);

            account.balance -= amount;
            account.balance = mcode.roundToCents(account.balance);
            //~ account.transactions.push(createTransaction("WITHDRAW", amount, account.balance));

            db.collection('Accounts')
                .updateOne({email: email}, {$set: {balance: mcode.roundToCents(account.balance)}}, {w: 1}, function (err, result)
                {
                    err ? reject(err) : resolve(account);
                });
        }
        else
        {
            const errorMsg = "Withdraw Funds FAILED, no Account for email: " + req.params.email;
            console.log(errorMsg);
            res.status(401).json({error: errorMsg});
        }
    });
};

// Return all User Accounts
function allAccounts()
{
    return new Promise(async (resolve, reject) =>
    {
        // grab all users from DB
        const allUsers = await db
            .collection('Accounts')
            .find({})
            .toArray(function (err, docs)
            {
                err ? reject(err) : resolve(docs);
            });
    });
};

module.exports = {createAccount, depositFunds, withdrawFunds, allAccounts};