

// This is a class that can be used to represent a record in different states.


// On the client, no id, need to lookup or create
//  ensure

// For the moment, want to create a record, and it will not have an ID to start with
//  Active_Record will link back to its Active_Table.

// Possibly more work on ensuring records in the core. Need a way that avoids race conditions.
// Should do more work on the core ensure.
//  When given a record with a missing key, and can generate that key, it does so.



// Going to do more work on the db inc client put and ensure records.
//  Possibly constraints should come before this anyway.
//  Ensure will help to avoid duplicates with indexes, but without constraints.
//  Put would rely on constaints to prevent bad overwrites.

// Changing Buffer-Backed record to Row, clarifying that.
//  Putting the rows just puts them in the DB
//  Putting records gets more complex.

// status
//  null - we don't know if the record is in the DB
//  undefined - the record is not in the db
//  false - the record is not in the db
//  true - the record is in the db

// sometimes the record's own data is in the PK
//  sometimes its just an ID, and the id is not an intrinsic part of the data

// Using active-record tech will make for a simpler code path when adding the records, while making sure the various checks are done correctly.

const lang = require('lang-mini');
const each = lang.each;
const def = lang.is_defined;
const Evented_Class = lang.Evented_Class;

const Model = require('nextleveldb-model');
const B_Record = Model.BB_Record;


class Active_Record extends Evented_Class {

    // Does ensure itself in the constructor?

    constructor(table, data) {
        //console.log('Active_Record');
        //console.log('table', table);
        //console.log('data', data);
        super();



        this.table = table;
        const db = table.db;
        let model_table = this.table.model;

        // Active_Record needs to be really flexible.
        //  Other parts of the system won't need flexibility like this.
        //  Active_Record needs to present a really simple API that allows records to have operations done on them easily from JavaScript.
        // Represents data that may or may not be in the database.

        // Want to represent unknown field values, such as IDs in cases where we don't have it.
        // Some records / tables have got primary keys that include the record's own data, and of course is used to identify that record.
        // Other records have an ID to identify that data.


        // Status

        // Can this store its data using buffer-backed row?
        //  Including when some fields are unknown / undefined.

        // could store non-bb data temporarily if necessary. Using callbacks etc
        // take some data too.

        // work out what data we are given fits into which fields.
        //  would be nice to get the kv fields in an array anyway.

        //let kv_field_names = model_table.kv_field_names;
        //console.log('Active_Record constructor kv_field_names', kv_field_names);

        // Best not to use a callback.
        //  The Active_Record will have its own promise / observable based async mechanisms.

        // can we put the data into a key and value matching this
        // Try creating an arr_key
        let arr_key = [];
        let kv_fields = table.kv_fields;
        //console.log('new_active_record kv_fields', kv_fields);
        // then make a map of these

        let map_fields = {};
        each(kv_fields[0], ((x, i) => map_fields[x] = [0, i]));
        each(kv_fields[1], ((x, i) => map_fields[x] = [1, i]));

        //console.log('map_fields', map_fields);
        // Then are there any fields in the kv that are not used in the data
        //  Could that be all the fields missing from the PK?
        //let map_fields_missing_from_data = {};

        //console.log('Active_Record data', data);

        let map_fields_from_data = {};

        // load data?
        //  active load attempt from data


        // Depending on the type of data
        //  If it's an active record, want to skip some properties.
        //   Maybe we should have active_record.data




        each(data, (value, name) => {

            //console.log('name', name);

            // look for the name

            let ref = map_fields[name];
            //console.log('name ' + name + ' ref', ref);

            map_fields_from_data[name] = true;
        });

        //console.log('map_fields_from_data', map_fields_from_data);

        // map the fields from the map_fields

        //each(map_fields, (value, name) => {
        //    console.log('2) name', name);
        //})


        // key fields missing

        let key_fields_missing = [];
        let value_fields_missing = [];


        each(kv_fields[0], (x, i) => {

            // but should that key even be in the record?
            //console.log('x', x);

            // 

            if (!map_fields_from_data[x]) {
                key_fields_missing.push(x);
            } else {

                arr_key.push(data[x]);
            }
        });

        each(kv_fields[1], (x, i) => {
            if (!map_fields_from_data[x]) {
                value_fields_missing.push(x);
            }
        });
        //console.log('key_fields_missing', key_fields_missing);
        //console.log('value_fields_missing', value_fields_missing);

        // get indexed field names from the model table as an operation.
        //let single_indexed_field_names = 

        let indexed_field_names_and_ids = model_table.indexed_field_names_and_ids;
        // indexed fields names and ids
        //console.log('indexed_field_names_and_ids', indexed_field_names_and_ids);

        // Has the market missing...



        // then do two separate lookups by that field.
        // Then if there is just one key field missing, it's an autoincrementing id.
        // Active_Record is a place that can handle some complexities of changing between JS data and DB data.
        //

        //  Also, check for indexed fields present.
        //  Lookup according to these index fields, using OR.
        //   Treat them as though they are unique, despite that not having been specified.

        // then get the field values to lookup

        //let to_lookup = {};
        let to_lookup_kv = {};

        // no key fields missing... can go straight ahead.


        // no value fields present.

        // If there are value fields present, we will need to put them into the array.



        if (key_fields_missing.length === 0) {
            // Missing all values.
            // no lookup needed
            //  just put it.

            // just key, no value given

            if (value_fields_missing.length === kv_fields[1].length) {
                arr_key.unshift(model_table.kp);
                // table_id, 
                //console.log('arr_key', arr_key);
                let br = new B_Record([arr_key, []]);
                //console.log('br', br);
                //console.log('br.decoded', br.decoded);

                // does still assume that the table is given as the kp....


                (async () => {
                    let res_ensure = await db.ensure_table_record(model_table.id, br);
                    //console.log('1) res_ensure', res_ensure);
                    this.record = res_ensure;
                    this.exists_in_db = true;
                    this.raise('ready');

                    //throw 'stop';
                })();
            } else {

                // need to put together the array of values as we can.
                arr_key.unshift(model_table.kp);

                let arr_values = [];
                each(kv_fields[1], (value_field) => {
                    //console.log('value_field', value_field);


                    if (value_field in data) {
                        arr_values.push(data[value_field]);
                    } else {
                        arr_values.push(undefined);
                    }
                });

                //console.log('arr_key', arr_key);

                //console.log('arr_values', arr_values);

                let br = new B_Record([arr_key, arr_values]);
                //console.log('br', br);
                //console.log('br.decoded', br.decoded);

                (async () => {
                    //console.log('pre ensure');
                    // ensure_table_record needs to return the value inside the command response message.
                    let res_ensure = await db.ensure_table_record(model_table.id, br);

                    //console.log('2) res_ensure', res_ensure);
                    this.record = res_ensure;
                    this.exists_in_db = true;
                    this.raise('ready');

                    //throw 'stop';
                })();

                // then can put that record....








                //console.trace();
                //throw 'new_active_record NYI';
            }





            //let br = new B_Record([undefined, values]);


        } else {
            if (key_fields_missing.length === 1 && value_fields_missing.length === 0) {
                // Check that the single missing key field is an autoincrementing primary key
                each(indexed_field_names_and_ids, ifnid => {
                    if (typeof data[ifnid[0]] !== 'undefined') {
                        //to_lookup[ifnids[0]] = data[ifn];
                        //to_lookup[ifnid[1]] = data[ifnid[0]];
                        to_lookup_kv[ifnid[0]] = data[ifnid[0]];

                    }
                })
            } else {
                console.log('key_fields_missing', key_fields_missing);
                console.log('value_fields_missing', value_fields_missing);
                console.log('indexed_field_names_and_ids', indexed_field_names_and_ids);
                console.log('data', data);
                // Could lookup types to see which objects correspond.

                // Need to assemble the key fields.
                //  Active_Record could look up the types somewhere.

                // The types of the data
                //  Or prototype

                // Could look the prototype up in a Map.
                //  

                // Active db[]



                // which of the fields in indexed_field_names_and_ids are almost id fields?
                //  or can have id fields

                /*
                let arr_key_fields_missing_ids_removed = [];
    
                each(key_fields_missing, kfm => {
                    let pos;
                    pos = kfm.lastIndexOf('_id');
                    if (pos === kfm.length - 3) {
                        let without_id = kfm.substring(0, pos);
                        arr_key_fields_missing_ids_removed.push([without_id, kfm]);
                    }
                    console.log('pos', pos);
    
                });
                // Hmmmm... may need to use the Active_Record versions of whatever we have right now.
    
                // Having a map of the coins by code would help.
                //  Don't need further db lookups
                console.log('arr_key_fields_missing_ids_removed', arr_key_fields_missing_ids_removed);
    
                each(arr_key_fields_missing_ids_removed, item => {
                    let [without_id, kfm] = item;
    
                    // if there is such an item without id
    
                    if ('without_id' in data && 'id' in data[without_id]) {
                        to_lookup_kv[kfm] = data[without_id].id;
                    }
    
                });
    
                console.log('to_lookup_kv', to_lookup_kv);
    
                // then find which of the fields we have been given:
                //  has an id property
                //  matches a name
    
                // need to set the lookup objects properly.
                */
                //  probably better to get the ids beforehand.
                // Could load in a converter for the data as it is to the 
                // so we have some fields, but are missing others
                //  should not be so hard for the system to deduce what those fields should be by exploring the data.

                console.trace();
                throw 'new_active_record NYI';


            }

            //console.log('to_lookup', to_lookup);

            // not sure about the lookup function.
            //  more a case for the core db.

            // multiple searches by different (unique) indexes
            //  though resistant to putting more into core now.
            //  maybe table_index_lookup

            /*
            
            each(to_lookup, (v, i) => {
                arr_lookups.push([i, v]);
            })
            console.log('arr_lookups', arr_lookups);
    
            */

            let arr_lookups = [];
            let m = model_table.record_def.map_indexes_by_field_names;
            //console.log('m', m);

            each(to_lookup_kv, (v, i) => {
                //
                let idx = m[JSON.stringify([i])];
                //console.log('!!idx', !!idx);
                //console.log('idx.id', idx.id);

                arr_lookups.push([idx.id, [v]]);

            });

            //console.log('arr_lookups', arr_lookups);

            // Doing multiple lookups (on same table) at same time would help.
            //  Checking multiple indexes.

            (async () => {

                let none_found = true;


                for (let lookup of arr_lookups) {
                    //console.log('lookup', lookup);

                    // table_index_lookup

                    //let lookup_res = await db.table_index_lookup(model_table.name, lookup[0], lookup[1]);
                    //console.log('pre table_record_lookup');
                    //

                    //console.log('Object.keys(db)', Object.keys(db));
                    //console.log('db', db);

                    //console.log('db.table_record_lookup', db.table_record_lookup);

                    //let lookup_res = await db.table_record_lookup(model_table.name, lookup[0], lookup[1][0]);
                    let lookup_res = await db.table_record_lookup(model_table.name, lookup[0], lookup[1][0]);
                    // table_pk_lookup instead
                    // table_record_lookup even
                    //  it is useful to get the record here.
                    // Should keep the data encoded for the moment too.
                    //console.log('lookup_res', lookup_res);

                    if (def(lookup_res)) {
                        //console.log('result has been found')
                        //console.log('lookup_res', lookup_res);
                        none_found = false;

                        if ('record' in this) {
                            // is it the same record?
                            //console.log('this.record.buffer', this.record.buffer);
                            //console.log('lookup_res', lookup_res.buffer);
                            let eq = this.record.buffer.equals(lookup_res.buffer);
                            //console.log('eq', eq);
                            if (!eq) {
                                this._status = 'lookup error';
                                throw 'lookup error';
                            }
                        }
                        this.record = lookup_res;
                        // Get its id (primary key really).
                        //  Need to then be able to use this Active_Record when other data refers to it.
                        //   May just look at the id
                        // Some records will have an ID (and that be it in the PK),
                        // Others will have a 
                        this.exists_in_db = true;
                    } else {
                        //console.log('lookup result not found');
                        // Processing later on, nothing to do here
                        //throw 'NYI';
                    }
                    //db.
                }




                if (none_found) {
                    //console.log('record not found already in db');
                    this.exists_in_db = false;
                    // status
                    //  put-record

                    //this.raise('ready');
                    // Create the record.

                    // Doing db put directly would be best.
                    //  Or even db ensure?
                    //  Don't want to leave time for the record to be put before.
                    //   Ensure works best with the db's queue.

                    // Need an ensure table record that recognises when it's generatable key is not given.

                    // Need to put the data in in order of the value fields.

                    // array of the values

                    let values = [];
                    each(model_table.kv_field_names[1], value_field_name => {
                        values.push(to_lookup_kv[value_field_name]);
                    })
                    //console.log('values', values);



                    let br = new B_Record([undefined, values]);
                    //console.log('br', br);
                    //console.log('br.buffer', br.buffer);
                    // then do db ensure table record.
                    //  need to give it the table name / id because its not got a key.

                    // Automatically ensures the record in the constructor!
                    //  Or finds the record...?
                    // 
                    let res_ensure = await db.ensure_table_record(model_table.id, br);
                    //console.log('res_ensure', res_ensure);
                    this.record = res_ensure;
                    this.exists_in_db = true;
                    this.raise('ready');
                    //  Maybe some lookup logic will be repeated on the server.
                    //   This helps to be sure.

                    //  Then can call that fn on the server.

                } else {
                    this.raise('ready');
                }
            })();
        }




        // then do the lookup on these fields.


        // Return the active record in a status where it's not done the lookup or got the data yet.


        // It will have some of its fields set.

        // Would have a 'ready' event. At that stage the active_record data will be in sync with the DB.
        //  To begin with, we need to check if the Active_Record can be found through the PK or indexed search.

        // status: 
        //   index_lookup
        //   pk_lookup
        //   current
        //   creating
        //   error

    }

    lookup(data) {
        console.log('lookup', data);
    }


    get key() {
        //console.trace();
        //console.log('this.record', this.record);

        return this.record.key;
    }
    get value() {
        return this.record.value;
    }

    get decoded() {
        return this.record.decoded;
    }

    get decoded_key_no_kp() {
        return this.record.decoded_key_no_kp;
    }

    // key without the kp?
    //  key.bare?
    //  



    // check if it exists according to the data...?

}

module.exports = Active_Record;