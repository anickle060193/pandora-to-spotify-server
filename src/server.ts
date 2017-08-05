import app from './App';

const port = process.env.PORT || 3000;

app.listen( port, ( error: any ) =>
{
    if( error )
    {
        console.error( error );
    }
    else
    {
        console.log( `Server is listening on ${port}.` );
    }
} );