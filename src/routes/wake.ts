import { Router } from 'express';

const wake = Router();

wake.get( '/', ( request, response, next ) =>
{
    console.log( 'Wake' );
    return response.status( 200 ).send();
} );

export default wake;