import React from 'react';
import Head from 'next/head'

interface HeadProps {
    titlePage: string;
    description: string;
}

export default function HeadSeo(head: HeadProps = {
    titlePage: '',
    description: '',
}){
    

    return(
        <Head>
            <title>{head.titlePage ? head.titlePage + ' - ' : ''}Oriente®</title>
            <meta name="description" content={head.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />            
        </Head>
    )
}