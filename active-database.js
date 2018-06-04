// Active Database

// Seems to have (more) client-side uses.
//  It is not in-process with the DB, but connects to it through the client.
//   Seems more like an actual part of the client.

// Active Database could run on the client, or on the server.
//  Connecting as a client seems most important.

// Needs to inherit from the model, but have a connection.
//  Could be connected to a client, or maybe to the database itself.
//  The encoding and decoding functionality would take place on the server.

// When active db loads, it loads all of the tables (and their components), 

// Allows creation of tables

// Allows creation of records
//  Connected records allow updates - but likely don't need this for many records we intend to be persisted without change.

// Allows querying of records.
//  Query within primary key range
//  Query within indexed range, looking up the indexed pk values, and individually looking up those records.

// This would make a convenient interface to then send and receive lots of trading records.
//  Would have another class that carries out specific queries to do with finanical information.
//  Want a JavaScript class that contains a Typed Array / Typed Arrays so that it stores a large amount of financial data in a nicely indexed and also computable way.

// Want to get this up and running with live trading data ASAP.

// 

// Extends the Model, or has a smaller API that uses Model items?

// Having actual Table and Record objects would be useful.
//  May need to use them in a different way / overlying API.

// This type of Active Database could then be extended with Crypto Active Database
/*
var model = require('../nextleveldb-model');
// The model database has been defined, and the connected database persists it / ensures it's already written.

var Database = model.Database;
*/
// Needs to have a client.
//  Make local_client for when it works on the server?
//   Client functionality, but does not use any sockets, runs in-process.

// Or this talks to a bridge to the database itself.
//  Or it's used on the client and the server, called by them, so does not need more means to talk to them.

// Will have a relatively simple API then, in order to fir as a part of both the client and the server?

// Or, 2 implementations of it?

// Focusing on client makes most sense for active record.
//  Maybe could code same tech into the server differently.

// When active database loads, it needs to populate itself.
//  Needs to create active tables

// What about reading the model from binary?
// Or create an Active_Database from a normal model?

// Or functionality to extend a model database into being an active model database?

// Want to have a Model DB, have it connected with the server, and changes made to the Model get made on the server.
//  Maybe too big a task for me in Oct 2017.



const Active_Table = require('./active-table');

const NextLevelDB_Model = require('nextleveldb-model');


/*

class Active_Database extends Database {

}

module.exports = Active_Database;
*/



// 13/05/2018

// Don't want AD to extend Model.
//  It will have various commands, but it will not keep track of (much) local data.
//  The DB client or the server already has an available Model. Don't extend Model, but use it by accessing it.


// start it with a connection to the DB.

// make active tables available
//  active tables will make the data available through calls to the client or the server - but those calls give the same results.

// core client functions will mirror the core server functions.
// worth starting core_client.
//  stop using 'll' terminology, its often open for debate. With the core, the answer is that it's not in the core if it's not needed for standard operations.

//  The core of both the client and the server will help non-core functionality work on both of them.

// Want to get these working piece by piece.
//  Maybe 10 critical functions that themselves should be fairly flexible.






//var model = require('../nextleveldb-model');
// The model database has been defined, and the connected database persists it / ensures it's already written.

//var Database = model.Database;


// Active_Database should wrap around the core db functionality.



class Active_Database {
    constructor(db) {
        //this.db = spec.db;

        this.db = db;

        // Not so sure about keeping Model references.
        //  Esp to different bits of the Model.

        // Maybe proxies would help getting a table





        // create new Active Table based on the model?

        //this.tables = [];

        // Proxies are probably too slow.

        // Will define the tables as properties.


        let map_active_tables = {};
        let model = db.model, table;

        //console.log('db', db);
        //console.log('Object.keys(db)', Object.keys(db));

        for (table of model.tables) {
            //console.log('Active_Database table', table);

            console.log('Active_Database table.name', table.name);

            ((table_name, table) => {
                Object.defineProperty(this, table_name, {
                    get() {
                        //console.log('get active table table_name', table_name);
                        //console.log('table', table);
                        //console.log('!!map_active_tables[table_name]', !!map_active_tables[table_name]);
                        //throw 'stop';

                        if (map_active_tables[table_name]) {
                            return map_active_tables[table_name];
                        } else {

                            // The active table needs to know the id
                            //  it could even look up the rest of its info from the DB
                            //  Not sure about doing this though.

                            // use the model table and the db connection?
                            // or give it just its id in the database, and have it load the info?

                            // easier to use the model - it's already been loaded

                            let res = new Active_Table(this, table);
                            map_active_tables[table_name] = res;
                            return res;

                            //let res = new Active_Table
                        }

                    }
                    //,
                    //set(value) {

                    //}
                })
            })(table.name, table);



        }


        /*
        return new Proxy(this, {
            get(target, prop) {

                / *
                if (Number(prop) == prop && !(prop in target)) {
                    return self.data[prop];
                }
                return target[prop];
                * /

            }
        });
        */


    }

    // iterate the tables.
    // can use the model for that

    // a new iterator each time could help to keep it consistent







    // For processing general records.
    //  Records have the table encoded within them already

    // put

    // get

    // delete

    // tables
    //  array of active_table.
    // incrementors
    //  active_incrementor



}

// 

module.exports = Active_Database;