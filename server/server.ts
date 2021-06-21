import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from '../src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import axios from 'axios';
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  server.use(bodyParser.json());
  server.use(cookieParser())
  const distFolder = join(process.cwd(), 'dist/pizzeria/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.route('/api/login').post(auth);
  server.route('/api/order').post(order);
  server.route('/api/order').get(getOrder);
  server.route('/api/order/:id').delete(deleteOrder);
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

export function auth(req, res) {
  const username = req?.body?.username;
  const password = req?.body?.password;
  axios.post('https://order-pizza-api.herokuapp.com/api/auth', {username, password}).then((authResponse) => {
    return res.send({
      token: authResponse?.data?.access_token
    });
  }).catch(() => {
    return res.status(401).send({
      message: 'Not Authorized'
    });
  })
}

export function order(req, res) {
  const orders = req?.body;
  const observables: any[] = [];

  orders.forEach((order, i) => {
    const body = {
      Crust: order.crust,
      Flavor: order.sauce,
      Size: order.size,
      Table_No: i
    };
    const token = req.headers['authorization'].split(' ')[1];

    observables.push(axios.post('https://order-pizza-api.herokuapp.com/api/orders', body, {headers: {
        Authorization: 'Bearer ' + token
      }} ))
  });

  axios.all(observables).then((response: any) => {
    console.log(response.data)
    return res.status(200).send({data: response?.data})
  }).catch( err => {
    console.log(err)
    if (err.status === 401) {
      return res.status(401).send({data: err?.data})
    }
    return res.status(400).send({data: err?.data})
  })

}

export function getOrder(req, res) {
  axios.get('https://order-pizza-api.herokuapp.com/api/orders').then((orders) => {
    return res.send({
      token: orders?.data
    });
  }).catch((err) => {
    if (err.status === 401) {
      return res.status(401).send({data: err?.data})
    }
    return res.status(400).send({data: err?.data})
  })
}

export function deleteOrder(req, res) {
  const id = req.params.id;
  console.log(`https://order-pizza-api.herokuapp.com/api/orders/${id}`)
  axios.delete(`https://order-pizza-api.herokuapp.com/api/orders/${id}`).then((delRes) => {
    return res.send({
      message: 'Success'
    });
  }).catch((err) => {
    if (err.status === 401) {
      return res.status(401).send({data: err?.data})
    }
    return res.status(400).send({data: err?.data})
  })
}



function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from '../src/main.server';
