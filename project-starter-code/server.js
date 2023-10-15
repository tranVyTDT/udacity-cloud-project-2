import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;
    console.log(`process image with URL ${imageUrl}`);
    if(imageUrl){
      filterImageFromURL(imageUrl.toString()).then((imagePath) => {
        console.log(`filtered success ${imagePath}`)
        return res.status(200).sendFile(imagePath, (error) => {
          if (error) {
            console.error('Error sending file:', err);
          } else {
            deleteLocalFiles([imagePath])
          }
        });
      }
      ).catch((error) => {
        console.log(`filtered error ${error}`)
        return res.status(422).send(error)
      }
      );
    } else {
      res.status(404).send(`Couldn't find image from imageUrl`)
    }
  });
  
  // // Root Endpoint
  // // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
