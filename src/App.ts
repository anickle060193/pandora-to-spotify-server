import * as express from 'express';
import * as cors from 'cors';

import stations from './routes/stations';
import stationLikes from './routes/stationLikes';

const app = express();

app.use( cors() );
app.use( '/stations', stations );
app.use( '/station-likes', stationLikes );

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
        response.status( error[ 'status' ] || 500 );
        response.render( 'error', {
            message: error.message,
            error
        } );
    } );
}

app.use( ( error: Error, request: express.Request, response: express.Response, next: express.NextFunction ) =>
{
    response.status( error[ 'status' ] || 500 );
    response.render( 'error', {
        message: error.message,
        error: { }
    } );
    return null;
} );

export default app;