package main

//region Usings
import "github.com/ravendb/ravendb-go-client"
//endregion

var globalDocumentStore *ravendb.DocumentStore

func main() {
    createDocumentStore()
    createDatabase()
    filteringQueryResultsBasics()
    globalDocumentStore.Close()
}

func createDocumentStore() (*ravendb.DocumentStore, error) {
    if globalDocumentStore != nil {
        return globalDocumentStore, nil
    }
    urls := []string{"http://localhost:8080"}
    store := ravendb.NewDocumentStore(urls, "testGO")
    err := store.Initialize()
    if err != nil {
        return nil, err
    }
    globalDocumentStore = store
    return globalDocumentStore, nil
}

func createDatabase() {
    databaseRecord := ravendb.NewDatabaseRecord()
    databaseRecord.DatabaseName = "testGO"
    createDatabaseOperation := ravendb.NewCreateDatabaseOperation(databaseRecord, 1)
    var err = globalDocumentStore.Maintenance().Server().Send(createDatabaseOperation)
    if err != nil {
        fmt.Printf("d.store.Maintenance().Server().Send(createDatabaseOperation) failed with %s\n", err)
    }
}

//region Demo
func filteringQueryResultsBasics() error {

    session, err := globalDocumentStore.OpenSession("")
    if err != nil {
        return err
    }
    defer session.Close()
    
    //region Step_1
    queriedType := reflect.TypeOf(&Employee{})
    filteredQuery := session.QueryCollectionForType(queriedType)
    //endregion
    
    //region Step_2
    filteredQuery = filteredQuery.Where("FirstName", "==", "Anne")
    //endregion

    //region Step_3
    var filteredEmployees []*Employee
    err = filteredQuery.GetResults(&filteredEmployees)
    if err != nil {
        return err
    }
    //endregion

    return nil
}

type Employee struct {
    ID         string
    LastName   string
    FirstName  string
    Title      string
}
//endregion
