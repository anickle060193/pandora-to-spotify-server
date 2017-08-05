import { Router } from 'express';
import * as url from 'url';
import * as rp from 'request-promise';

const stationsLikes = Router();

stationsLikes.get( '/:stationId', ( request, response, next ) =>
{
    console.log( 'Station Likes: ' + request.params.stationId );

    let oldUrl = url.parse( request.url, true );
    let newUrl = url.format( { protocol: 'https', host: 'www.pandora.com', pathname: '/content/station_track_thumbs/', search: oldUrl.search } );
    return rp( newUrl )
        .then( ( data ) =>
        {
            return response.status( 200 ).send( data );
        } )
        .catch( ( error ) =>
        {
            let statusCode = error && error.statusCode || 500;
            let message = error && error.message || 'An error occured.';
            return response.status( statusCode ).send( message );
        } );
} );

export default stationsLikes;