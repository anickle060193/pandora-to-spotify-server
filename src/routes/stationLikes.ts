import { Router } from 'express';
import * as url from 'url';
import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

const stationsLikes = Router();

stationsLikes.get( '/:stationId', async ( request, response, next ) =>
{
    let stationId = request.params.stationId;
    console.log( `Station Likes: ${stationId}` );

    try
    {
        let nextStartIndex = 0;
        let lastNextStartIndex = -1;
        let likes = [ ];
        do
        {
            console.log( `Station Likes - Station: ${stationId} - Next Start Index: ${nextStartIndex}` );
            let result = await getStationLikes( stationId, nextStartIndex );
            likes.push( ...result.likes );
            lastNextStartIndex = nextStartIndex;
            nextStartIndex = result.nextStartIndex;
        }
        while( nextStartIndex
            && nextStartIndex !== -1
            && nextStartIndex !== lastNextStartIndex );

        return response.status( 200 ).type( 'json' ).json( likes );
    }
    catch( error )
    {
        let statusCode = error && error.statusCode || 500;
        let message = error && error.message || 'An error occured.';
        return response.status( statusCode ).send( message );
    }
} );

export default stationsLikes;

function getStationLikes( stationId: string, index: number )
{
    let query = {
        stationId: stationId,
        posFeedbackStartIndex: index,
        posSortAsc: false,
        posSortBy: 'date'
    };
    let newUrl = url.format( { protocol: 'https', host: 'www.pandora.com', pathname: '/content/station_track_thumbs/', query: query } );
    return rp( newUrl )
        .then( ( data ) =>
        {
            let $ = cheerio.load( data );
            let likesList = $( 'li h3' ).map( ( index, element ) => {
                let children = $( element ).children();
                return {
                    trackName: children.first().text(),
                    artist: children.last().text()
                };
            } ).get();

            if( $( '.no_more' ).length > 0 )
            {
                return {
                    nextStartIndex: -1,
                    likes: likesList
                };
            }
            else
            {
                let nextStartIndex = $( '.show_more' ).data( 'nextstartindex' );

                return {
                    nextStartIndex: nextStartIndex,
                    likes: likesList
                };
            }
        } );
}