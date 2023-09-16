import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, TextField, InputAdornment,Alert  } from '@mui/material';
import { Box } from '@mui/system';
import  getBodyRequest  from '../functions/queryMongo.js';

const headersAuth = { 'Content-Type': 'application/json' };
const headersRequest = {
    Accept: "application/json",  'Content-Type': 'application/json',
    Authorization: "Bearer " + localStorage.getItem('jwt')
};
const headersRequestMongo = {
    Accept: "application/json",  'Content-Type': 'application/json',
    'api-key':process.env.REACT_APP_URL_API_Mongo_APIKEY, 'Access-Control-Request-Headers':'*'
    , 'X-Requested-With': 'XMLHttpRequest'
};




async function getAuthToken() {
    const options = {
        method: 'POST',
        headers: headersAuth,
        body: JSON.stringify({
            username: process.env.REACT_APP_USR,
            password: process.env.REACT_APP_PASS,
        }),
    };
    return await fetch(process.env.REACT_APP_URL_API_BOOK + '/authenticate', options)
        .then(response => response.json())
        .then(jwt => {
            //console.log(jwt.jwtToken);
            localStorage.setItem("jwt", jwt.jwtToken)
            headersRequest.Authorization = "Bearer " + localStorage.getItem('jwt')
            return jwt;
        }).catch(e => console.log(e))
}

async function getData(pageNo, pageSize, pattern) {
    const options = {
        method: 'GET',
        headers: headersRequest,
    };

   
    return await fetch(process.env.REACT_APP_URL_API_BOOK + '/api/book/findByPattern/' + pattern + '?' + 'pageNo=' + pageNo + '&pageSize=' + pageSize, options)
        .then(response => {  return response.status === 403?"retry":response.json()})  
        //.then(data => { console.log(data); return data; })
        .catch(e => { console.log(e); return "retry"; })

}

async function getDataMongo(pageNo, pageSize, pattern) {
    
    var patternEscape = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\\\" + '$&');
    var bodyRequest = getBodyRequest(pageNo, pageSize, pattern,patternEscape); 
    const options = {
        method: 'POST',
        headers: headersRequestMongo,
        body: bodyRequest
    };

    return await fetch(process.env.REACT_APP_URL_API_Mongo + '/aggregate' , options)
        .then(response => {  return response.status === 403?"retry":response.json()})  
        .then(data => { console.log(data); return data; })
        .catch(e => { console.log(e); return "retry"; })

}


const loadServerRows = (page, pagSize, allRows, pattern) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(() => {
                (async () => {
                    let aux = await getDataMongo((page + 1) * pagSize, pagSize, pattern);
                    if (aux === 'retry') {
                        //let jwt = await getAuthToken();
                        //console.log("Intentar de nuevo")
                        //aux = await getData(page + 1, pagSize, pattern);
                        //console.log("ver2:" + aux);
                    }
                    
                    if(aux && aux !== 'retry'){
                        allRows.push(...aux)
                        allRows.slice(page * pagSize, (page + 1) * pagSize);
                    }

                })();
            });
        }, 5000);
    });


const useQuery = (page, pageSize, allRows, pattern) => {
    const [rowCount, setRowCount] = React.useState(undefined);
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    //if(!pattern || pattern.length === 0 ) return { isLoading, data, rowCount };
    React.useEffect(() => {
        let active = true;

        setIsLoading(true);
        setRowCount(undefined);
        loadServerRows(page, pageSize, allRows, pattern).then((newRows) => {
            if (!active) {
                return;
            }
            //console.log("newRows")
            //console.log(newRows);
            setData(newRows);
            setIsLoading(false);
            setRowCount(allRows.length);
        });

        return () => {
            active = false;
        };
    }, [page, pageSize, allRows]);

    return { isLoading, data, rowCount };
};



export default function DataGridComp() {
    const [data, setData] = React.useState([]);
    const [rowCount, setRowCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(false);


    const [pattern, setPattern] = React.useState("17)");
    const [rowsState, setRowsState] = React.useState({ page: 0, pageSize: 10, })


    //const pageChange = (newPage) => { setPage(newPage); }
    const URL_TOMO = (window.location.hostname.includes("localhost"))?'http://localhost:3000/page':'https://tercetfiat.github.io/libroCielo/page';
   
    const search = (eventOrVal) => {

        setIsLoading(true);
        setRowCount(undefined);
        (async () => {
            let aux = await getDataMongo(Number.isInteger(eventOrVal)?(eventOrVal)*rowsState.pageSize :0, rowsState.pageSize, pattern);
            if (aux === 'retry') {
                //let jwt = await getAuthToken();
                //aux = await getDataMongo(Number.isInteger(eventOrVal)?eventOrVal:0, rowsState.pageSize, pattern);

            }
            //console.log(aux)
            if (aux  && aux !== 'retry') {
              setData(aux.documents[0].data);
              setRowCount(aux.documents[0].total);
              setIsLoading(false);
            }else if(aux ==='retry')setIsLoading(false);

        })();

    };

    const newPattern = (event) => { setPattern(event.target.value); }

    const [rowCountState, setRowCountState] = React.useState(rowCount || 0);
    React.useEffect(() => {
        setRowCountState((prevRowCountState) => rowCount !== undefined ? rowCount : prevRowCountState,);
    }, [rowCount, setRowCountState]);


    return (
        <div style={{ height: 400, width: '100%' }}>
            <Box>
                <Stack spacing={2} direction="row">
                    <TextField label="Palabra" id="idPattern" onChange={newPattern}
                        InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }}
                    />
                    <Button variant="contained" color="success" onClick={search}> Search</Button>
                </Stack>
                <Alert severity="info">Dandole click al número de la pagina habrirá la pagina completa, "Lecturas" son las que se encontrarón en la página</Alert>
            </Box>
            <DataGrid
                rows={data}
                rowCount={rowCountState}
                getRowId={(row) => Math.random()}  //http://localhost:3000/page , https://tercetfiat.github.io/libroCielo/page
                columns={[
                    {
                        field: "page",
                        headerName: "Página",
                        renderCell: (params) => (
                        <div onClick={() => { window.open(URL_TOMO + params.value + '.html') }}> {params.value}</div>
                        ),
                        width: 57
                    },
                    
                    {
                        field: "chapter",
                        headerName: "Libro",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), "type": "number",
                        width: 57
                    },
                    {
                        field: "lec",
                        headerName: "Lecturas",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), "type": "number",
                        width: 105
                    }
                    ,
                    {
                        field: "area",
                        headerName: "Encontrado",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), width: 900
                    },
                ]}
                pagination
                {...rowsState}
                paginationMode="server"
                onPageChange={(page) => { setRowsState((prev) => ({ ...prev, page }));  search(page); }}
                onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
                components={{ Toolbar: GridToolbar, }}
                loading={isLoading}
            />
        </div>
    );
}