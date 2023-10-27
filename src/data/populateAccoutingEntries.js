"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var faker_1 = require("@faker-js/faker");
var supabase = (0, supabase_js_1.createClient)("https://vmwzmajqhmtuvfjkczdb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd3ptYWpxaG10dXZmamtjemRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzNjk0NTIsImV4cCI6MjAxMzk0NTQ1Mn0.LgUdiFzERf7u2kyFcDePy_FktXxbu-VVf_vALU-itxY");
function parseDate(dateString) {
    var dateParts = dateString.split("/");
    if (dateParts.length !== 3) {
        throw new Error("Invalid date format");
    }
    var day = parseInt(dateParts[1], 10);
    var month = parseInt(dateParts[0], 10) - 1;
    var year = parseInt(dateParts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Invalid date components");
    }
    return new Date(year, month, day);
}
var generateFakeAccountingEntry = function () {
    var today = new Date();
    var twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    // Generate a random date within the past 2 years
    var randomDate = new Date(twoYearsAgo.getTime() +
        Math.random() * (today.getTime() - twoYearsAgo.getTime()));
    // Keep track of the number of transactions for each month
    var monthlyTransactionCount = new Map();
    // Calculate the year and month of the random date
    var year = randomDate.getFullYear();
    var month = randomDate.getMonth();
    // Initialize the transaction count for the month if it doesn't exist
    if (!monthlyTransactionCount.has(year * 100 + month)) {
        monthlyTransactionCount.set(year * 100 + month, 0);
    }
    var isSpecialScenario = Math.random() > 0.9; // 10% chance for a special scenario
    if (isSpecialScenario) {
        // Special scenarios: "self" payer, "finance@ifs.co" payer, "Debit" type
        return {
            payer: "COMPANY",
            amount: faker_1.faker.number.int({ min: 100, max: 1000 }),
            date: parseDate(randomDate.toLocaleDateString()),
            email: "finance@ifs.co",
            type: "Debit",
        };
    }
    else {
        // Regular scenario: Other payers and random type (Debit or Credit)
        // Check if the monthly transaction limit is reached, and if so, reset the count
        if (monthlyTransactionCount.get(year * 100 + month) >= 15) {
            monthlyTransactionCount.set(year * 100 + month, 0);
        }
        // Increment the transaction count for the month
        monthlyTransactionCount.set(year * 100 + month, (monthlyTransactionCount === null || monthlyTransactionCount === void 0 ? void 0 : monthlyTransactionCount.get(year * 100 + month)) + 1);
        return {
            payer: faker_1.faker.person.fullName(),
            amount: faker_1.faker.number.int({ min: 100, max: 500 }),
            date: parseDate(randomDate.toLocaleDateString()),
            email: faker_1.faker.internet.email(),
            type: Math.random() > 0.5 ? "Debit" : "Credit",
        };
    }
};
function insertFakeData() {
    return __awaiter(this, void 0, void 0, function () {
        var numEntriesToInsert, fakeData, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    numEntriesToInsert = 25;
                    fakeData = Array.from({ length: numEntriesToInsert }, function (v, k) { return generateFakeAccountingEntry(); });
                    console.log(fakeData);
                    return [4 /*yield*/, supabase
                            .from('accountingentry')
                            .upsert(fakeData)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error('Error inserting data:', error);
                    }
                    else {
                        console.log('Data inserted successfully:', data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Call the function to insert the data
insertFakeData();
