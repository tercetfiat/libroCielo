import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Stack, TextField, InputAdornment } from '@mui/material';
import { Box } from '@mui/system';
const headersAuth = {
    'Content-Type': 'application/json'
};

const headersRequest = {
    Accept: "application/json",  'Content-Type': 'application/json',
    Authorization: "Bearer " + localStorage.getItem('jwt')
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
            console.log(jwt.jwtToken);
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
        .then(response => { return response.status === 403?"retry":response.json()})  
        .then(data => { console.log(data); return data; })
        .catch(e => { console.log(e); return "retry"; })

}

const loadServerRows = (page, pagSize, allRows, pattern) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(() => {
                (async () => {
                    let aux = await getData(page + 1, pagSize, pattern);
                    if (aux === 'retry') {
                        let jwt = await getAuthToken();
                        console.log("Intentar de nuevo")
                        aux = await getData(page + 1, pagSize, pattern);
                        console.log("ver2:" + aux);
                    }

                    if(aux && aux !== 'retry'){
                        //console.log("ver :" + aux);
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
            console.log("newRows")
            console.log(newRows);
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
    //const [data, setData] = React.useState([]);
    //const [rowCount, setRowCount] = React.useState(0);
    //const [isLoading, setiSLoading] = React.useState(false);


    const [pattern, setPattern] = React.useState("17)");
    const [rowsState, setRowsState] = React.useState({ page: -1, pageSize: 10, })


    //const pageChange = (newPage) => { setPage(newPage); }

    /*const search =  React.useCallback( () => {
        if (isLoading) return;
        const { isLoading2, data2, rowCount2 } = useQuery(rowsState.page,rowsState.pageSize,[],pattern);
        isLoading = isLoading2;
        data = data2;
        rowCount = rowCount2;

    },[isLoading]);*/


    const newPattern = (event) => { setPattern(event.target.value); }

    const [rowCountState, setRowCountState] = React.useState(rowCount || 0);
    React.useEffect(() => {
        setRowCountState((prevRowCountState) => rowCount !== undefined ? rowCount : prevRowCountState,);
    }, [rowCount, setRowCountState]);


    const { isLoading, data, rowCount } = useQuery(
        rowsState.page,
        rowsState.pageSize,
        [], pattern);
    return (
        <div style={{ height: 400, width: '100%' }}>
            <Box>
                <Stack spacing={2} direction="row">
                    <TextField label="Palabra" id="idPattern" onChange={newPattern} defaultValue="17)"
                        InputProps={{ startAdornment: <InputAdornment position="start"></InputAdornment> }}
                    />
                    <Button variant="contained" color="success">Search</Button>
                </Stack>
            </Box>
            <DataGrid
                rows={data}
                rowCount={rowCountState}
                columns={[
                    {
                        field: "page",
                        headerName: "Pagina",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), "type": "number",
                        width: 100
                    },
                    {
                        field: "chapter",
                        headerName: "Capitulo",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), "type": "number",
                        width: 100
                    },
                    {
                        field: "substring",
                        headerName: "Encontrado",
                        renderCell: (params) => (
                            <div> {params.value}</div>
                        ), width: 300
                    },
                ]}
                pagination
                {...rowsState}
                paginationMode="server"
                onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
                onPageSizeChange={(pageSize) => setRowsState((prev) => ({ ...prev, pageSize }))}
                components={{ Toolbar: GridToolbar, }}
                loading={isLoading}
            />
        </div>
    );
}