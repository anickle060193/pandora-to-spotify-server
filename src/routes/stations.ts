import { Router } from 'express';
import * as url from 'url';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

const stations = Router();

stations.get( '/:username', async ( request, response, next ) =>
{
    let username = request.params.username;
    console.log( 'Stations: ' + username );

    let query = {
        startIndex: 0,
        webname: username
    };
    let newUrl = url.format( { protocol: 'https', host: 'www.pandora.com', pathname: '/content/stations/', query: query } );

    let jar = rp.jar();
    jar.setCookie( rp.cookie( 'at=wOV69NG5MjdXetjSbEwrXhp+3DRT9Sa1F3StkVPUa4yBJbkAH4vE924LdiJQ/7LOf9sZTl5G6AJMi5NAHE38hsSrAzjOI3aDwY2RBbkFtbBJmTZAJloA1qqhbL9o2CwrUvmjtwks3mL8=' ), newUrl );

    try
    {
        let htmlData = await rp( { url: newUrl, jar: jar } );
        let $ = cheerio.load( htmlData );
        let stationsList = $( '#stations_container h3 span.artist_name a' ).map( ( index, element ) => {
            let cElement = $( element );
            return {
                stationId: cElement.attr( 'href' ).replace( '/station/', '' ),
                stationName: cElement.text().replace( / Radio$/, '' )
            };
        } ).get();

        return response.status( 200 ).type( 'json' ).json( stationsList );
    }
    catch( error )
    {
        let statusCode = error && error.statusCode || 500;
        let message = error && error.message || 'An error occured.';
        return response.status( statusCode ).send( message );
    }
} );

export default stations;