let dbName = 'default';
let dbVersion = 1;
const stores = []; 
let conn = null;

const createConnection = () => 
    new Promise((resolve, reject) =>
    {
        const request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = e =>
        {
            const transactionalConn = e.target.result;
            for(let i = 0; i < stores.length; i++)
            {
                if(transactionalConn.objectStoreNames.contains(stores[i])) 
                    transactionalConn.deleteObjectStore(stores[i]);
                transactionalConn.createObjectStore(stores[i], { keyPath: "id", autoIncrement: true });
            }     
        };

        request.onsuccess = e =>
        {
            conn = e.target.result; 
            resolve();
        }
        
        request.onerror = e =>
        {
            console.log(e.target.error);
            return Promise.reject('Não foi possível obter a conexão com o banco');
        }; 
    });

class Manager
{

    setDbName(name)
    {
        dbName = name;
        return this;
    }

    setDbVersion(version)
    {
        dbVersion = version;
        return this;
    }

    async register(...mappers)
    {
        mappers.forEach(mapper => 
            stores.push(mapper));
        await createConnection();
    }

    save(data)
    {
        return new Promise((resolve, reject) =>
        {
            if(!conn) return reject('Você precisa registrar o banco antes de utilizá-lo');
            const store = data.nome;
            const request = conn
                .transaction([store],"readwrite")
                .objectStore(store)
                .add(data.data);
            request.onsuccess = () => resolve();
            request.onerror = e => {
                console.log(e.target.error);
                return reject('Não foi possível persistir o objeto');
            };
        });
    }

    list(name)
    {
        return new Promise((resolve, reject) =>
        {
            const store = name;
            const transaction = conn
                .transaction([store],'readwrite')
                .objectStore(store); 
            const cursor = transaction.openCursor();
            const list = [];
            cursor.onsuccess = e =>
            {
                const current = e.target.result;
                 if(current)
                 {
                    list[current.primaryKey] = current.value;
                    current.continue();
                } else resolve(list);
            };
            cursor.onerror = e =>
            {
                console.log(target.error);
                reject(`Não foi possível lista os dados da store ${store}.`);
            };  
        });    
    } 

    getOne(data)
    {
        return new Promise((resolve, reject) =>
        {
            const store = data.name;
            const result = conn
                .transaction([store],'readwrite')
                .objectStore(store)
                .get(data.id);
            result.onsuccess = e =>
            {
                resolve(result.result);
            };
            result.onerror = e =>
            {
                console.log(target.error);
                reject(`Não foi possível lista os dados da store ${store}.`);
            };  
        }); 
    }   

    update(data)
    {
        return new Promise((resolve, reject) =>
        {
            const store = data.name;
            const result = conn
                .transaction([store],'readwrite')
                .objectStore(store)
                .put(data.data);
            result.onsuccess = e =>
            {
                resolve();
            };
            result.onerror = e =>
            {
                console.log(target.error);
                reject(`Não foi possível lista os dados da store ${store}.`);
            };  
        });
    }
}

export const manager = new Manager();