# <first-name>-<last-name>-iwh-i-practicum

Practicum project for **Integrating With HubSpot I: Foundations** (HubSpot Academy).

A Node.js web app built with **Express**, **Axios** and **Pug** that connects to the
HubSpot CRM API (v3) with a Private App access token. The homepage lists every
record in a table, and a form lets the user create a new record in HubSpot.

## HubSpot object

**Link to the object in my developer test account:**

https://app.hubspot.com/contacts/<TEST-ACCOUNT-ID>/objects/0-1/views/all/list

This project uses the standard **Contacts** object (`0-1`) because custom objects
were not available in my test account. The practicum allows a standard object in
that case.

### Properties

| Label | Internal name | Type |
|---|---|---|
| First Name | `firstname` | Single-line text |
| Last Name | `lastname` | Single-line text |
| Email | `email` | Single-line text |

## Routes

| Route | Method | What it does |
|---|---|---|
| `/` | GET | Fetches all records from HubSpot and renders `homepage.pug` as a table |
| `/update-cobj` | GET | Renders `updates.pug`, the form for adding a record |
| `/update-cobj` | POST | Sends the form data to HubSpot to create a record, then redirects to `/` |

## How it works

- **Reading records:** `GET /crm/v3/objects/contacts`. HubSpot returns at most
  100 records per request, so the server follows the `paging.next.after` cursor
  in a loop until every record has been collected.
- **Creating a record:** `POST /crm/v3/objects/contacts` with the properties from the form.
- **Authentication:** `Authorization: Bearer <token>`, with the token read from `.env`.

## Project structure

```
.
├── index.js            # Express server and routes
├── views/
│   ├── homepage.pug    # Records table
│   └── updates.pug     # Add-record form
├── public/
│   └── css/
│       └── style.css   # Styling
├── package.json
├── .gitignore          # ignores node_modules and .env
└── README.md
```

## Run it locally

1. Clone the repository and install the dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root:
   ```
   PRIVATE_APP_ACCESS_TOKEN=your_private_app_token
   ```
3. Start the app:
   ```bash
   node index.js
   ```
4. Open http://localhost:3000

### Private App scopes

- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.schemas.custom.read`
- `crm.objects.custom.read`
- `crm.objects.custom.write`

## Tech stack

Node.js, Express, Axios, Pug, dotenv, HubSpot CRM API v3, Git and GitHub.

## Security

The access token lives in `.env`, which is listed in `.gitignore`.
No token is committed to this repository.