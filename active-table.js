const fnl = require('fnl');
const prom_or_cb = fnl.prom_or_cb;
const lang = require('lang-mini');
const each = lang.each;

// Active-Table will be useful for adding new records
//  It's possible for an Active Table to have its own records, active or inactive.

// Want to make it so that Active Table is an efficient interface for interacting with datasets.

// Will also be able to get data in the required formats through Active Table. Could have some data structures available on the Server. Probably keep them out of the Model?
//  May well want to download multi-MB chuncks of tightly packed binary Typed Array data, then process it very quickly upon arrival.

const Active_Record = require('./active-record');




class Active_Table {
    constructor(active_db, model_table) {

        this.active_db = active_db;
        let db = this.db = active_db.db;
        this.model = this.model_table = model_table;

        // Listen to the model for changes to the table?

        Object.defineProperty(this, 'records', {
            // 
            // get an Active_Record_List / Set


            get() {
                //console.log('get records');

                // return Active_Records object probably.

                // will get the data from an observable and yield appropriately.
                //  seems a bit tricky with observable to iterable

                // would read from some kind of result buffer.

                // could get all of the records at once.

                // don't have all the answers, so get the observable here.
                //console.log('model_table.id', model_table.id);
                let obs_records = db.get_table_records(model_table.id);
                /*
                obs_records.on('next', data => {
                    console.log('data', data);
                });
                obs_records.on('complete', () => {
                    console.log('complete');
                });
                */
                return obs_records;

                // Can the observable itself be iterable?
                //  Maybe noe...


                // Some type of simple queue will help.
            }
        })
    }

    get fields() {
        return this.model.fields;
    }
    get kv_fields() {
        return this.model.kv_fields;
    }


    count(callback) {
        /*
        return prom_or_cb((resolve, reject) => {

        })
        */

        return this.db.count_table_records(this.model_table.id, callback);
    }
    // and kv_fields

    // not so sure about using other types here.
    //  it should be possible to take an object, and turn it into a Record or Active_Record.

    // the OO coin could have a to_b_record function.
    //  would take some inputs as well as necessary, such as table id.
    //  just taking the model table would be best.

    // Can check has in terms of just data?


    has(record_or_key, callback) {
        return prom_or_cb((resolve, reject) => {
            console.log('has record_or_key', record_or_key);
            console.log('record_or_key', record_or_key);

            console.trace();



            //let key = record_or_key.key;
            //console.log('key.decoded', key.decoded);

        }, callback);
        // key.key = same object.
        // do the lookup by key
        //  has_key would be a useful (core) operation in the db itself

    }


    lookup(data) {
        // does lookups by fields.

        console.log('lookup', data);

        // will do simultaneous lookups too.

        // lookup by separate fields and values.
        //  will get the id of the record if it can find it.

        // need to determine which index to use for which field.
        //  index of indexes. while it will be in the db, we use an index of indexes in the model.

        // model_table.get_index_by_field()

        let single_indexes = [];
        console.log('this.model', this.model);
        console.log('this.model.map_indexes_by_field_names', this.model.map_indexes_by_field_names);
        each(data, (v, k) => {
            if (this.model.map_indexes_by_field_names[k]) {
                single_indexes.push(this.model.map_indexes_by_field_names[k]);
            }
        });
        console.log('single_indexes.length', single_indexes.length);
    }

    // A promise that responds when the Active_Record is ready.

    // Or elsewhere waits for the active record to become ready.

    new_active_record(data) {
        // Active_Record itself can do much of this.
        //console.log('new_active_record');
        let res = new Active_Record(this, data);
        return res;

        //throw 'stop';


    }



    // But if it's not a record itself.
    //  ....


    ensure(record, callback) {
        // Async function.
        //  Waits until the active record is ready

        return prom_or_cb((resolve, reject) => {
            //console.log('pre new_active_record');
            let res = this.new_active_record(record);
            res.on('ready', async () => {
                //console.log('Active_Record is ready');
                // We can tell the ar status...
                //console.log('res', res);
                //console.log('res.exists_in_db', res.exists_in_db);

                //console.log('res.record', res.record);
                //console.log('Object.keys(res)', Object.keys(res));

                resolve(res);
            });
        }, callback);
    }


    put(record, callback) {
        //console.log('8) put record', record);
        return prom_or_cb((resolve, reject) => {
            //console.log('pre new_active_record');
            // without an initial lookup?

            let res = this.new_active_record(record);
            //console.log('res', res);
            res.on('ready', async () => {
                //console.log('Active_Record is ready');
                // We can tell the ar status...
                //console.log('res', res);
                //console.log('res.exists_in_db', res.exists_in_db);


                //console.log('res.record', res.record);
                //console.log('Object.keys(res)', Object.keys(res));

                resolve(res);
            });
        }, callback);

        // check for overwrite?
        //  maybe that would be elsewhere? - yes, in Active_Record

        // Can put the lower level records.
    }
    // Operations will be carried out using the active database, or the db connection itself obtained from the active database.
}

module.exports = Active_Table;