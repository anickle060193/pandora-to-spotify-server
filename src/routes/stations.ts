import { Router } from 'express';
import * as url from 'url';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

const stations = Router();

stations.get( '/:username', ( request, response, next ) =>
{
    let username = request.params.username;
    console.log( 'Stations: ' + username );

    let newUrl = url.format( { protocol: 'https', host: 'www.pandora.com', pathname: '/content/stations/', query: { startIndex: 0, webname: username } } );

    let jar = rp.jar();
    jar.setCookie( rp.cookie( 'at=woLHZimYH3wf/Pu/U8eUM/XcMXanerCMMxiDXmZEjLvZgUyAZliC+l8Yg15mRIy72DlxLzLZ5Oe6+aO3CSzeYvw==' ), newUrl );

    return rp( { url: newUrl, jar: jar } )
        .then( ( data ) =>
        {
            let $ = cheerio.load( data );
            let stationsList = $( '#stations_container h3 span.artist_name a' ).map( ( index, element ) => {
                let cElement = $( element );
                return {
                    stationId: cElement.attr( 'href' ).replace( '/station/', '' ),
                    stationName: cElement.text().replace( / Radio$/, '' )
                };
            } ).get();

            return response.status( 200 ).json( stationsList );
        } )
        .catch( ( error ) =>
        {
            let statusCode = error && error.statusCode || 500;
            let message = error && error.message || 'An error occured.';
            return response.status( statusCode ).send( message );
        } );
} );

export default stations;