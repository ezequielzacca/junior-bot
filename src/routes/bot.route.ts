import { INTENT_TESTEAR_APP } from './../constants/intents.constants';
import { Router, Request, Response, NextFunction } from 'express';
import * as language from '@google-cloud/language';


export class TodoRouter {
  router: Router
  languageClient: any;

  /**
   * Initialize the Todo Router
   */
  constructor() {
    this.router = Router();
    this.init();

  }



  /**
   * GET all Todos.
   */
  public apiaiHook(req: Request, res: Response, next: NextFunction) {
    console.log("Hook Request");
    let speech: string = 'empty speech';

    if (req.body) {
      let requestBody = req.body;
      let action = requestBody.result.action;
      let parameters = requestBody.result.parameters;
      if (requestBody.result) {      

        if (action === INTENT_TESTEAR_APP) {
          //speech += 'action: ' + requestBody.result.action;          
          
            let possibleAnswers = [
              `¿Me pediste que testeara ${parameters.name} ${parameters.env} ${parameters.parte}?`              
            ]
            let random = Math.floor(Math.random() * possibleAnswers.length);
            console.log("random value: ", random);
            let speech = possibleAnswers[random];
            return res.json({
              speech: speech,
              displayText: speech,
              source: 'apiai-webhook-sample'
            });          
        
        } else if (requestBody.result.action == "input.unknown") {
          //speech += 'action: ' + requestBody.result.action;
          let input = requestBody.result.resolvedQuery;
          let languageClient = language({
            projectId: 'todosassistant@todosassistant-164919.iam.gserviceaccount.com',
            keyFilename: `${__dirname}/../gcloudconfig.json`
          });
          let document = languageClient.document(input);
          document.detectSentiment(function (err, sentiment) {
            console.log("err: ", err);
            console.log("sentiment: ", sentiment);
            console.log("sentiment is positive: ", sentiment.score > 0.3);
            console.log("sentiment is negative: ", sentiment.score <= -0.3);
            if (sentiment) {
              if (sentiment.score <= -0.3) {
                return res.json({
                  speech: "Uhhh tranquilo por favor, solo soy un simple robot",
                  displayText: "Uhhh tranquilo por favor, solo soy un simple robot",
                  source: 'apiai-webhook-sample'
                });
              } else if (sentiment.score > 0.3) {
                return res.json({
                  speech: "Siempre es agradable charlar con gente amable",
                  displayText: "Siempre es agradable charlar con gente amable",
                  source: 'apiai-webhook-sample'
                });
              } else {
                return res.json({
                  speech: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                  displayText: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                  source: 'apiai-webhook-sample'
                });
              }

            } else {
              return res.json({
                speech: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                displayText: "¿Perdon? No entiendo lo que me pides, ¿Puedes decirlo de otra manera?",
                source: 'apiai-webhook-sample'
              });
            }
          });

        }
      }
    }

  }

  
  init() {
    
    this.router.post('/hook', this.apiaiHook);

  }

}

// Create the TodosRouter, and export its configured Express.Router
const todosRouter = new TodoRouter();
todosRouter.init();

export default todosRouter.router;