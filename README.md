<p align="center">
    <br>
    <img src="https://rawgithub.com/nextapps-de/flexsearch/master/doc/flexsearch.svg" alt="Search Library" width="50%">
    <br><br>
    <a target="_blank" href="https://www.npmjs.com/package/flexsearch-server"><img src="https://img.shields.io/npm/v/flexsearch-server.svg"></a>
    <img src="https://img.shields.io/badge/status-BETA-orange.svg">
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch-server/issues"><img src="https://img.shields.io/github/issues/nextapps-de/flexsearch-server.svg"></a>
    <a target="_blank" href="https://github.com/nextapps-de/flexsearch-server/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/flexsearch-server.svg"></a>
</p>
<h1>FlexSearch Server for Node.js (Cluster)</h1>

Documentation of FlexSearch is available here: <a target="_blank" href="https://github.com/nextapps-de/flexsearch-server">https://github.com/nextapps-de/flexsearch-server</a>

<a name="installation"></a>
## Installation

```npm
npm install flexsearch-server
```

Run setup once:

```node
npm run setup
```

Run as single web server:

```node
npm start
```

Run as server cluster:

```node
npm run cluster
```

The server is listening at:

<table>
    <tr>
        <td>Environment</td>
        <td>Server Address</td>
    </tr>
    <tr></tr>
    <tr>
        <td>development</td>
        <td>http://localhost</td>
    </tr>
     <tr></tr>
    <tr>
        <td>production<br><br></td>
        <td>http://localhost:6780<br>https://localhost:6780</td>
    </tr>
     <tr></tr>
    <tr>
        <td>test</td>
        <td>http://localhost</td>
    </tr>
</table>

<a name="api"></a>
## API Overview

__RESTful__

<table>
    <tr>
        <td>Request Type</td>
        <td>Endpoint</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>GET</td>
        <td>/</td>
        <td>Returns info about the index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POST</td>
        <td>/add/:id/:content</td>
        <td>Add content to the index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POST</td>
        <td>/update/:id/:content</td>
        <td>Update content of the index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>GET</td>
        <td>/search/:query</td>
        <td>Search for query</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POST</td>
        <td>/remove/:id</td>
        <td>Remove id from the index</td>
    </tr>
</table>

__JSON__

<table>
    <tr>
        <td>Request Type</td>
        <td>Endpoint</td>
        <td>Body</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>POST</td>
        <td>/add</td>
        <td>JSON</td>
        <td>Add multiple contents to the index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POST</td>
        <td>/update</td>
        <td>JSON</td>
        <td>Update multiple contents of the index</td>
    </tr>
    <tr></tr>
    <tr>
        <td>GET</td>
        <td>/search</td>
        <td>JSON</td>
        <td>Search for query (custom search)</td>
    </tr>
    <tr></tr>
    <tr>
        <td>POST</td>
        <td>/remove</td>
        <td>JSON</td>
        <td>Remove multiple ids from the index</td>
    </tr>
</table>

<a name="env"></a>
## Server Environment Variables

<table>
    <tr>
        <td>Variable</td>
        <td>Values</td>
        <td>Default</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>PORT</td>
        <td>80</td>
        <td>80</td>
        <td>Server listening port</td>
    </tr>
    <tr></tr>
    <tr>
        <td>FORCE_SSL</td>
        <td>true<br>false</td>
        <td>false</td>
        <td>Accept HTTPS connections only</td>
    </tr>
    <tr></tr>
    <tr>
        <td>HTTPS</td>
        <td>true<br>false</td>
        <td>false</td>
        <td>Start the HTTPS server</td>
    </tr>
    <tr></tr>
    <tr>
        <td>COMPRESS</td>
        <td>true<br>false</td>
        <td>true</td>
        <td>Enable/Disable response compression (gzip)</td>
    </tr>
</table>

---

Copyright 2019 Nextapps GmbH<br>
Released under the <a href="http://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache 2.0 License</a><br>
