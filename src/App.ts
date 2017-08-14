import * as express from 'express';
import * as cors from 'cors';

import stations from './routes/stations';
import stationLikes from './routes/stationLikes';
import wake from './routes/wake';

const app = express();

app.use( cors() );
app.use( '/stations', stations );
app.use( '/station-likes', stationLikes );
app.use( '/wake', wake );

app.use( ( request, response, next ) =>
{
    let err = new Error( 'Not Found' );
    err[ 'status' ] = 404;
    next( err );
} );

if( app.get( 'env' ) === 'development' )
{
    app.use( ( error: Error, request: express.Request, response: express.Response, next: express.NextFunction ) =>
    {
        return response.status( error[ 'status' ] || 500 ).json( {
            message: error.message,
            error: error
        } );
    } );
}

app.use( ( error: Error, request: express.Request, response: express.Response, next: express.NextFunction ) =>
{
    return response.status( error[ 'status' ] || 500 ).json( {
        message: error.message,
        error: { }
    } );
} );

export default app;