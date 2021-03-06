
import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { join } from 'path';

// agregar aqui rutas a los diferentes endpoints
//import * as admin from "firebase-admin";

//Routers
import BotRouter from "./routes/bot.route";

class App {

    public express: express.Application;

    constructor() {
        //set moment locale
        
        //wire up the app
        this.express = express();
        this.middleware();
        this.routes();        
        this.setErrorHandler();
    }


    private middleware(): void {
        
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '55mb' }));

        this.express.use(cors());
        this.express.use(express.static(path.join(__dirname, 'wwwroot')));
        this.express.use(express.static(join(__dirname, 'public')));
        //this.express.set('view engine', 'ejs');
    }

    private routes(): void {
        let router = express.Router();
        //example route
        /*this.express.use('/api/v1/laboratorios', LaboratorioRouter);*/
        router.get('/', (req, res, next) => {
            
            res.json({
                alive: true                
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1/bot', BotRouter);
       
    }

    

    private setErrorHandler(): void {
        this.express.use((err, req, res, next) => {
            console.log(err);
            res.status(500);
            res.send({
                message: 'Hubo un error en el servidor, por favor intente de nuevo mas tarde o contactese con el soporte',
                error: err
            });
        });
    }
}

export default new App().express;