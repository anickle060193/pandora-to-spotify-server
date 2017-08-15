import { Router } from 'express';

const wake = Router();

wake.get( '/', ( request, response, next ) =>
{
    console.log( 'Wake' );
    return response.status( 200 ).json( { message: 'You\'ve woken the server!' } );
} );

export default wake;