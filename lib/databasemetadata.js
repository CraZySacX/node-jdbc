/* jshint node: true */
"use strict";
var _ = require('lodash');
var ResultSet = require('./resultset');
var Connection = require('./connection');
var jinst = require('./jinst');
var java = jinst.getInstance();

function DatabaseMetaData(dbm) {
  this._dbm = dbm;
}

/**
 * Retrieves the schema names available in this database.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is a schema description
 */
DatabaseMetaData.prototype.getSchemas = function(catalog, schemaPattern, callback) {
  if(_.isFunction(catalog)) {
    callback = catalog;
    catalog = null;
  } else if(_.isFunction(schemaPattern)) {
    callback = schemaPattern;
    schemaPattern = null;
  }

  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getSchemas(catalog, schemaPattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the tables available in the given catalog.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} tableNamePattern - A table name pattern; must match the table name as it is stored in the database
 * @param {String[]} types -  A list of table types, which must be from the list of table types returned from getTableTypes(),to include; null returns all types
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a table description
 */
DatabaseMetaData.prototype.getTables = function(catalog, schemaPattern, tableNamePattern, types, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(tableNamePattern) || _.isUndefined(tableNamePattern) || _.isString(tableNamePattern)) &&
    (_.isNull(types) || _.isUndefined(types) || _.isArray(types))
  );

  if(_.isArray(types)) {
    _.forEach(types, function(type) {
      if(_.isString(type)) return;
      validParams = false;
      return false;
    });
  }

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getTables(catalog, schemaPattern, tableNamePattern, types, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves whether the current user can call all the procedures returned by
 * the method getProcedures.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.allProceduresAreCallable = function(callback) {
  this._dbm.allProceduresAreCallable(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether the current user can use all the tables returned by the
 * method getTables in a SELECT statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.allTablesAreSelectable = function(callback) {
  this._dbm.allTablesAreSelectable(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a SQLException while autoCommit is true inidcates that all
 * open ResultSets are closed, even ones that are holdable.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.autoCommitFailureClosesAllResultSets = function(callback) {
  this._dbm.autoCommitFailureClosesAllResultSets(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a data definition statement within a transaction forces
 * the transaction to commit.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.dataDefinitionCausesTransactionCommit = function(callback) {
  this._dbm.dataDefinitionCausesTransactionCommit(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database ignores a data definition statement within a
 * transaction.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.dataDefinitionIgnoredInTransactions = function(callback) {
  this._dbm.dataDefinitionIgnoredInTransactions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether or not a visible row delete can be detected by calling the
 * method ResultSet.rowDeleted.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if deletes are detected by the given result set type; false otherwise
 */
DatabaseMetaData.prototype.deletesAreDetected = function(type, callback) {
  var validParams = _.isInteger(type);
  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.deletesAreDetected(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether the return value for the method getMaxRowSize includes the
 * SQL data types LONGVARCHAR and LONGVARBINARY.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.doesMaxRowSizeIncludeBlobs = function(callback) {
  this._dbm.doesMaxRowSizeIncludeBlobs(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a generated key will always be returned if the column
 * name(s) or index(es) specified for the auto generated key column(s) are
 * valid and the statement succeeds.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.generatedKeyAlwaysReturned = function(callback) {
  this._dbm.generatedKeyAlwaysReturned(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the given attribute of the given type for a
 * user-defined type (UDT) that is available in the given schema and catalog.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} typeNamePattern - A type name pattern; must match the type name as it is stored in the database
 * @param {String} attributeNamePattern - An attribute name pattern; must match the attribute name as it is declared in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is an attribute description
 */
DatabaseMetaData.prototype.getAttributes = function(catalog, schemaPattern, typeNamePattern, attributeNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(typeNamePattern) || _.isUndefined(typeNamePattern) || _.isString(typeNamePattern)) &&
    (_.isNull(attributeNamePattern) || _.isUndefined(attributeNamePattern) || _.isString(attributeNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getAttributes(catalog, schemaPattern, typeNamePattern, attributeNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of a table's optimal set of columns that uniquely
 * identifies a row.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in the database
 * @param {Number} scope - The scope of interest; use same values as SCOPE
 * @param {Boolean} nullable - Include columns that are nullable
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a column description
 */
DatabaseMetaData.prototype.getBestRowIdentifier = function(catalog, schema, table, scope, nullable, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table) &&
    _.isInteger(scope) &&
    _.isBoolean(nullable)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getBestRowIdentifier(catalog, schema, table, scope, nullable, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the catalog names available in this database.
 *
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row has a single String column that is a catalog name
 */
DatabaseMetaData.prototype.getCatalogs = function(callback) {
  this._dbm.getCatalogs(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the String that this database uses as the separator between a
 * catalog and table name.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the separator string
 */
DatabaseMetaData.prototype.getCatalogSeparator = function(callback) {
  this._dbm.getCatalogSeparator(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the database vendor's preferred term for "catalog".
 *
 * @param {Function} callback
 * @returns {String} Via callback: the vendor term for "catalog"
 */
DatabaseMetaData.prototype.getCatalogTerm = function(callback) {
  this._dbm.getCatalogTerm(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a list of the client info properties that the driver supports.
 *
 * @param {Function} callback
 * @returns {ResultSet} Via callback: A ResultSet object; each row is a supported client info property
 */
DatabaseMetaData.prototype.getClientInfoProperties = function(callback) {
  this._dbm.getClientInfoProperties(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the access rights for a table's columns.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in the database
 * @param {String} columnNamePattern - A column name pattern; must match the column name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a column privilege description
 */
DatabaseMetaData.prototype.getColumnPrivileges = function(catalog, schema, table, columnNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table) &&
    (_.isNull(columnNamePattern) || _.isUndefined(columnNamePattern) || _.isString(columnNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getColumnPrivileges(catalog, schema, table, columnNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of table columns available in the specified catalog.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} tableNamePattern - A table name pattern; must match the table name as it is stored in the database
 * @param {String} columnNamePattern - A column name pattern; must match the column name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a column description
 */
DatabaseMetaData.prototype.getColumns = function(catalog, schemaPattern, tableNamePattern, columnNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(tableNamePattern) || _.isUndefined(tableNamePattern) || _.isString(tableNamePattern)) &&
    (_.isNull(columnNamePattern) || _.isUndefined(columnNamePattern) || _.isString(columnNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getColumns(catalog, schemaPattern, tableNamePattern, columnNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the connection that produced this metadata object.
 *
 * @param {Function} callback
 * @returns {Connection} Via callback: the connection that produced this metadata object
 */
DatabaseMetaData.prototype.getConnection = function(callback) {
  this._dbm.getConnection(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new Connection(result));
  });
};

/**
 * Retrieves a description of the foreign key columns in the given foreign key
 * table that reference the primary key or the columns representing a unique
 * constraint of the parent table (could be the same or a different table).
 *
 * @param {String} parentCatalog - A catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means drop catalog name from the selection criteria
 * @param {String} parentSchema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means drop schema name from the selection criteria
 * @param {String} parentTable - The name of the table that exports the key; must match the table name as it is stored in the database
 * @param {String} foreignCatalog - A catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means drop catalog name from the selection criteria
 * @param {String} foreignSchema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means drop schema name from the selection criteria
 * @param {String} foreignTable - The name of the table that imports the key; must match the table name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a foreign key column description
 */
DatabaseMetaData.prototype.getCrossReference = function(parentCatalog, parentSchema, parentTable, foreignCatalog, foreignSchema, foreignTable, callback) {
  var validParams = (
    (_.isNull(parentCatalog) || _.isUndefined(parentCatalog) || _.isString(parentCatalog)) &&
    (_.isNull(parentSchema) || _.isUndefined(parentSchema) || _.isString(parentSchema)) &&
    _.isString(parentTable) &&
    (_.isNull(foreignCatalog) || _.isUndefined(foreignCatalog) || _.isString(foreignCatalog)) &&
    (_.isNull(foreignSchema) || _.isUndefined(foreignSchema) || _.isString(foreignSchema)) &&
    _.isString(foreignTable)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getCrossReference(parentCatalog, parentSchema, parentTable, foreignCatalog, foreignSchema, foreignTable, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the major version number of the underlying database.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the underlying database's major version
 */
DatabaseMetaData.prototype.getDatabaseMajorVersion = function(callback) {
  this._dbm.getDatabaseMajorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the minor version number of the underlying database.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: underlying database's minor version
 */
DatabaseMetaData.prototype.getDatabaseMinorVersion = function(callback) {
  this._dbm.getDatabaseMinorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the name of this database product.
 *
 * @param {Function} callback
 * @returns {String} Via callback: database product name
 */
DatabaseMetaData.prototype.getDatabaseProductName = function(callback) {
  this._dbm.getDatabaseProductName(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the version number of this database product.
 *
 * @param {Function} callback
 * @returns {String} Via callback: database version number
 */
DatabaseMetaData.prototype.getDatabaseProductVersion = function(callback) {
  this._dbm.getDatabaseProductVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves this database's default transaction isolation level.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the default isolation level
 */
DatabaseMetaData.prototype.getDefaultTransactionIsolation = function(callback) {
  this._dbm.getDefaultTransactionIsolation(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves this JDBC driver's major version number.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: JDBC driver major version
 */
DatabaseMetaData.prototype.getDriverMajorVersion = function(callback) {
  this._dbm.getDriverMajorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves this JDBC driver's minor version number.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: JDBC driver minor version
 */
DatabaseMetaData.prototype.getDriverMinorVersion = function(callback) {
  this._dbm.getDriverMinorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the name of this JDBC driver.
 *
 * @param {Function} callback
 * @returns {String} Via callback: JDBC driver name
 */
DatabaseMetaData.prototype.getDriverName = function(callback) {
  this._dbm.getDriverName(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the version number of this JDBC driver as a String.
 *
 * @param {Function} callback
 * @returns {String} Via callback: JDBC driver version
 */
DatabaseMetaData.prototype.getDriverVersion = function(callback) {
  this._dbm.getDriverVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the foreign key columns that reference the given
 * table's primary key columns (the foreign keys exported by a table).
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in this database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is a foreign key column description
 */
DatabaseMetaData.prototype.getExportedKeys = function(catalog, schema, table, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getExportedKeys(catalog, schema, table, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves all the "extra" characters that can be used in unquoted identifier
 * names (those beyond a-z, A-Z, 0-9 and _).
 *
 * @param {Function} callback
 * @returns {String} Via callback: the string containing the extra characters
 */
DatabaseMetaData.prototype.getExtraNameCharacters = function(callback) {
  this._dbm.getExtraNameCharacters(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the given catalog's system or user function
 * parameters and return type.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} functionNamePattern - A procedure name pattern; must match the function name as it is stored in the database
 * @param {String} columnNamePattern - A column name pattern; must match the column name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row describes a user function parameter, column or return type
 */
DatabaseMetaData.prototype.getFunctionColumns = function(catalog, schemaPattern, functionNamePattern, columnNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(functionNamePattern) || _.isUndefined(functionNamePattern) || _.isString(functionNamePattern)) &&
    (_.isNull(columnNamePattern) || _.isUndefined(columnNamePattern) || _.isString(columnNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getFunctionColumns(catalog, schemaPattern, functionNamePattern, columnNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the system and user functions available in the
 * given catalog.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} functionNamePattern - A procedure name pattern; must match the function name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a function description
 */
DatabaseMetaData.prototype.getFunctions = function(catalog, schemaPattern, functionNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(functionNamePattern) || _.isUndefined(functionNamePattern) || _.isString(functionNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getFunctions(catalog, schemaPattern, functionNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the string used to quote SQL identifiers.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the quoting string or a space if quoting is not supported
 */
DatabaseMetaData.prototype.getIdentifierQuoteString = function(callback) {
  this._dbm.getIdentifierQuoteString(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the primary key columns that are referenced by
 * the given table's foreign key columns (the primary keys imported by a
 * table).
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in this database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a primary key column description
 */
DatabaseMetaData.prototype.getImportedKeys = function(catalog, schema, table, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getImportedKeys(catalog, schema, table, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the given table's indices and statistics.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in this database
 * @param {Boolean} unique - When true, return only indices for unique values; when false, return indices regardless of whether unique or not
 * @param {Boolean} approximate - When true, result is allowed to reflect approximate or out of data values; when false, results are requested to be accurate
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is an index column description
 */
DatabaseMetaData.prototype.getIndexInfo = function(catalog, schema, table, unique, approximate, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table) &&
    _.isBoolean(unique) &&
    _.isBoolean(approximate)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getIndexInfo(catalog, schema, table, unique, approximate, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the major JDBC version number for this driver.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: JDBC version major number
 */
DatabaseMetaData.prototype.getJDBCMajorVersion = function(callback) {
  this._dbm.getJDBCMajorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the minor JDBC version number for this driver.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: JDBC version minor number
 */
DatabaseMetaData.prototype.getJDBCMinorVersion = function(callback) {
  this._dbm.getJDBCMinorVersion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of hex characters this database allows in an
 * inline binary literal.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum length (in hex characters) for a binary literal; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxBinaryLiteralLength = function(callback) {
  this._dbm.getMaxBinaryLiteralLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters that this database allows in a
 * catalog name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed in a catalog name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxCatalogNameLength = function(callback) {
  this._dbm.getMaxCatalogNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters this database allows for a
 * character literal.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed for a character literal; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxCharLiteralLength = function(callback) {
  this._dbm.getMaxCharLiteralLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters this database allows for a column
 * name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed for a column name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnNameLength = function(callback) {
  this._dbm.getMaxColumnNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of columns this database allows in a GROUP BY
 * clause.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of columns allowed; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnsInGroupBy = function(callback) {
  this._dbm.getMaxColumnsInGroupBy(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of columns this database allows in an index.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of columns allowed; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnsInIndex = function(callback) {
  this._dbm.getMaxColumnsInIndex(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of columns this database allows in an ORDER BY
 * clause.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of columns allowed; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnsInOrderBy = function(callback) {
  this._dbm.getMaxColumnsInOrderBy(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of columns this database allows in a SELECT
 * list.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of columns allowed; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnsInSelect = function(callback) {
  this._dbm.getMaxColumnsInSelect(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of columns this database allows in a table.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of columns allowed; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxColumnsInTable = function(callback) {
  this._dbm.getMaxColumnsInTable(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of concurrent connections to this database that
 * are possible.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of active connections possible at one time; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxConnections = function(callback) {
  this._dbm.getMaxConnections(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters that this database allows in a
 * cursor name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed in a cursor name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxCursorNameLength = function(callback) {
  this._dbm.getMaxCursorNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of bytes this database allows for an index,
 * including all of the parts of the index.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of bytes allowed; this limit includes the composite of all the constituent parts of the index; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxIndexLength = function(callback) {
  this._dbm.getMaxIndexLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters that this database allows in a
 * procedure name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed in a procedure name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxProcedureNameLength = function(callback) {
  this._dbm.getMaxProcedureNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of bytes this database allows in a single row.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of bytes allowed for a row; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxRowSize = function(callback) {
  this._dbm.getMaxRowSize(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters that this database allows in a
 * schema name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed in a schema name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxSchemaNameLength = function(callback) {
  this._dbm.getMaxSchemaNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters this database allows in an SQL
 * statement.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed for an SQL statement; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxStatementLength = function(callback) {
  this._dbm.getMaxStatementLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of active statements to this database that can
 * be open at the same time.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of statements that can be open at one time; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxStatements = function(callback) {
  this._dbm.getMaxStatements(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters this database allows in a table
 * name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed for a table name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxTableNameLength = function(callback) {
  this._dbm.getMaxTableNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of tables this database allows in a SELECT
 * statement.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of tables allowed in a SELECT statement; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxTablesInSelect = function(callback) {
  this._dbm.getMaxTablesInSelect(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the maximum number of characters this database allows in a user
 * name.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the maximum number of characters allowed for a user name; a result of zero means that there is no limit or the limit is not known
 */
DatabaseMetaData.prototype.getMaxUserNameLength = function(callback) {
  this._dbm.getMaxUserNameLength(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a comma-separated list of math functions available with this
 * database.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the list of math functions supported by this database
 */
DatabaseMetaData.prototype.getNumericFunctions = function(callback) {
  this._dbm.getNumericFunctions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the given table's primary key columns.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in this database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a primary key column description
 */
DatabaseMetaData.prototype.getPrimaryKeys = function(catalog, schema, table, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getPrimaryKeys(catalog, schema, table, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the given catalog's stored procedure parameter
 * and result columns.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database
 * @param {String} columnNamePattern - A column name pattern; must match the column name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row describes a stored procedure parameter or column
 */
DatabaseMetaData.prototype.getProcedureColumns = function(catalog, schemaPattern, procedureNamePattern, columnNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(procedureNamePattern) || _.isUndefined(procedureNamePattern) || _.isString(procedureNamePattern)) &&
    (_.isNull(columnNamePattern) || _.isUndefined(columnNamePattern) || _.isString(columnNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getProcedureColumns(catalog, schemaPattern, procedureNamePattern, columnNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the stored procedures available in the given
 * catalog.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} procedureNamePattern - A procedure name pattern; must match the procedure name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a procedure description
 */
DatabaseMetaData.prototype.getProcedures = function(catalog, schemaPattern, procedureNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(procedureNamePattern) || _.isUndefined(procedureNamePattern) || _.isString(procedureNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getProcedures(catalog, schemaPattern, procedureNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the database vendor's preferred term for "procedure".
 *
 * @param {Function} callback
 * @returns {String} Via callback: the vendor term for "procedure"
 */
DatabaseMetaData.prototype.getProcedureTerm = function(callback) {
  this._dbm.getProcedureTerm(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the pseudo or hidden columns available in a given
 * table within the specified catalog and schema.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} tableNamePattern - A table name pattern; must match the table name as it is stored in the database
 * @param {String} columnNamePattern - A column name pattern; must match the column name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a column description
 */
DatabaseMetaData.prototype.getPseudoColumns = function(catalog, schemaPattern, tableNamePattern, columnNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(tableNamePattern) || _.isUndefined(tableNamePattern) || _.isString(tableNamePattern)) &&
    (_.isNull(columnNamePattern) || _.isUndefined(columnNamePattern) || _.isString(columnNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getPseudoColumns(catalog, schemaPattern, tableNamePattern, columnNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves this database's default holdability for ResultSet objects.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the default holdability; either ResultSet.HOLD_CURSORS_OVER_COMMIT or ResultSet.CLOSE_CURSORS_AT_COMMIT
 */
DatabaseMetaData.prototype.getResultSetHoldability = function(callback) {
  this._dbm.getResultSetHoldability(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Indicates whether or not this data source supports the SQL ROWID type, and
 * if so the lifetime for which a RowId object remains valid.
 *
 * NOTE: This method should be used with caution for now. The RowIdLifetime object
 * returned is a Java object and is not wrapped by the node-jdbc library.
 *
 * @param {Function} callback
 * @returns {RowIdLifetime} Via callback: the status indicating the lifetime of a RowId
 */
DatabaseMetaData.prototype.getRowIdLifetime = function(callback) {
  this._dbm.getRowIdLifetime(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the database vendor's preferred term for "schema".
 *
 * @param {Function} callback
 * @returns {String} Via callback: the vendor term for "schema"
 */
DatabaseMetaData.prototype.getSchemaTerm = function(callback) {
  this._dbm.getSchemaTerm(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the string that can be used to escape wildcard characters.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the string used to escape wildcard characters
 */
DatabaseMetaData.prototype.getSearchStringEscape = function(callback) {
  this._dbm.getSearchStringEscape(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a comma-separated list of all of this database's SQL keywords that
 * are NOT also SQL:2003 keywords.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the list of this database's keywords that are not also SQL:2003 keywords
 */
DatabaseMetaData.prototype.getSQLKeywords = function(callback) {
  this._dbm.getSQLKeywords(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Indicates whether the SQLSTATE returned by SQLException.getSQLState is
 * X/Open (now known as Open Group) SQL CLI or SQL:2003.
 *
 * @param {Function} callback
 * @returns {Number} Via callback: the type of SQLSTATE; one of: sqlStateXOpen or sqlStateSQL
 */
DatabaseMetaData.prototype.getSQLStateType = function(callback) {
  this._dbm.getSQLStateType(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a comma-separated list of string functions available with this
 * database.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the list of string functions supported by this database
 */
DatabaseMetaData.prototype.getStringFunctions = function(callback) {
  this._dbm.getStringFunctions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the table hierarchies defined in a particular
 * schema in this database.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} tableNamePattern - A table name pattern; must match the table name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is a type description
 */
DatabaseMetaData.prototype.getSuperTables = function(catalog, schemaPattern, tableNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(tableNamePattern) || _.isUndefined(tableNamePattern) || _.isString(tableNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getSuperTables(catalog, schemaPattern, tableNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the user-defined type (UDT) hierarchies defined
 * in a particular schema in this database.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} typeNamePattern - A UDT name pattern; may be a fully-qualified name
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which a row gives information about the designated UDT
 */
DatabaseMetaData.prototype.getSuperTypes = function(catalog, schemaPattern, typeNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(typeNamePattern) || _.isUndefined(typeNamePattern) || _.isString(typeNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getSuperTypes(catalog, schemaPattern, typeNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a comma-separated list of system functions available with this
 * database.
 *
 * @param {Function} callback
 * @returns {String} Via callback: a list of system functions supported by this database
 */
DatabaseMetaData.prototype.getSystemFunctions = function(callback) {
  this._dbm.getSystemFunctions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of the access rights for each table available in a
 * catalog.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} tableNamePattern - A table name pattern; must match the table name as it is stored in the database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: each row is a table privilege description
 */
DatabaseMetaData.prototype.getTablePrivileges = function(catalog, schemaPattern, tableNamePattern, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(tableNamePattern) || _.isUndefined(tableNamePattern) || _.isString(tableNamePattern))
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getTablePrivileges(catalog, schemaPattern, tableNamePattern, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the table types available in this database.
 *
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row has a single String column that is a table type
 */
DatabaseMetaData.prototype.getTableTypes = function(callback) {
  this._dbm.getTableTypes(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a comma-separated list of the time and date functions available
 * with this database.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the list of time and date functions supported by this database
 */
DatabaseMetaData.prototype.getTimeDateFunctions = function(callback) {
  this._dbm.getTimeDateFunctions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of all the data types supported by this database.
 *
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is an SQL type description
 */
DatabaseMetaData.prototype.getTypeInfo = function(callback) {
  this._dbm.getTypeInfo(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves a description of the user-defined types (UDTs) defined in a
 * particular schema.
 *
 * @param {String} catalog - A  catalog name; must match the catalog name as it is stored in the database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schemaPattern - A schema name pattern; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} typeNamePattern - A UDT name pattern; may be a fully-qualified name
 * @param {Number[]} types - A list of user-defined types (JAVA_OBJECT, STRUCT, or DISTINCT) to include; null returns all types
 * @param {Function} callback
 * @returns {ResultSet} Via callback: ResultSet object in which each row describes a UDT
 */
DatabaseMetaData.prototype.getUDTs = function(catalog, schemaPattern, typeNamePattern, types, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schemaPattern) || _.isUndefined(schemaPattern) || _.isString(schemaPattern)) &&
    (_.isNull(typeNamePattern) || _.isUndefined(typeNamePattern) || _.isString(typeNamePattern)) &&
    (_.isNull(types) || _.isUndefined(types) || _.isArray(types))
  );

  if(_.isArray(types)) {
    _.forEach(types, function(type) {
      if(_.isInteger(type)) return;
      validParams = false;
      return false;
    });
  }

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getUDTs(catalog, schemaPattern, typeNamePattern, types, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves the URL for this DBMS.
 *
 * @param {Function} callback
 * @returns {String} Via callback: the URL for this DBMS or null if it cannot be generated
 */
DatabaseMetaData.prototype.getURL = function(callback) {
  this._dbm.getURL(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves the user name as known to this database.
 *
 * @param {Function} callback
 * @returns {String} Via callback: Retrieves the user name as known to this database
 */
DatabaseMetaData.prototype.getUserName = function(callback) {
  this._dbm.getUserName(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves a description of a table's columns that are automatically updated
 * when any value in a row is updated.
 *
 * @param {String} catalog - A catalog name; must match the catalog name as it is stored in this database; "" retrieves those without a catalog; null means that the catalog name should not be used to narrow the search
 * @param {String} schema - A schema name; must match the schema name as it is stored in the database; "" retrieves those without a schema; null means that the schema name should not be used to narrow the search
 * @param {String} table - A table name; must match the table name as it is stored in this database
 * @param {Function} callback
 * @returns {ResultSet} Via callback: a ResultSet object in which each row is a column description
 */
DatabaseMetaData.prototype.getVersionColumns = function(catalog, schema, table, callback) {
  var validParams = (
    (_.isNull(catalog) || _.isUndefined(catalog) || _.isString(catalog)) &&
    (_.isNull(schema) || _.isUndefined(schema) || _.isString(schema)) &&
    _.isString(table)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.getVersionColumns(catalog, schema, table, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, new ResultSet(result));
  });
};

/**
 * Retrieves whether or not a visible row insert can be detected by calling the
 * method ResultSet.rowInserted.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if changes are detected by the specified result set type; false otherwise
 */
DatabaseMetaData.prototype.insertsAreDetected = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.insertsAreDetected(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog appears at the start of a fully qualified table
 * name.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.isCatalogAtStart = function(callback) {
  this._dbm.isCatalogAtStart(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database is in read-only mode.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.isReadOnly = function(callback) {
  this._dbm.isReadOnly(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Indicates whether updates made to a LOB are made on a copy or directly to
 * the LOB.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if updates are made to a copy of the LOB; false if updates are made directly to the LOB
 */
DatabaseMetaData.prototype.locatorsUpdateCopy = function(callback) {
  this._dbm.locatorsUpdateCopy(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports concatenations between NULL and
 * non-NULL values being NULL.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.nullPlusNonNullIsNull = function(callback) {
  this._dbm.nullPlusNonNullIsNull(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether NULL values are sorted at the end regardless of sort
 * order.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.nullsAreSortedAtEnd = function(callback) {
  this._dbm.nullsAreSortedAtEnd(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether NULL values are sorted at the start regardless of sort
 * order.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.nullsAreSortedAtStart = function(callback) {
  this._dbm.nullsAreSortedAtStart(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether NULL values are sorted high.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.nullsAreSortedHigh = function(callback) {
  this._dbm.nullsAreSortedHigh(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether NULL values are sorted low.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.nullsAreSortedLow = function(callback) {
  this._dbm.nullsAreSortedLow(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether deletes made by others are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if deletes made by others are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.othersDeletesAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.othersDeletesAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether inserts made by others are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if inserts made by others are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.othersInsertsAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.othersInsertsAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether updates made by others are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if updates made by others are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.othersUpdatesAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.othersUpdatesAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a result set's own deletes are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if deletes are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.ownDeletesAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.ownDeletesAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a result set's own inserts are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if inserts are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.ownInsertsAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.ownInsertsAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether for the given type of ResultSet object, the result set's
 * own updates are visible.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if updates are visible for the given result set type; false otherwise
 */
DatabaseMetaData.prototype.ownUpdatesAreVisible = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.ownUpdatesAreVisible(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case unquoted SQL identifiers
 * as case insensitive and stores them in lower case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesLowerCaseIdentifiers = function(callback) {
  this._dbm.storesLowerCaseIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case quoted SQL identifiers as
 * case insensitive and stores them in lower case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesLowerCaseQuotedIdentifiers = function(callback) {
  this._dbm.storesLowerCaseQuotedIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case unquoted SQL identifiers
 * as case insensitive and stores them in mixed case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesMixedCaseIdentifiers = function(callback) {
  this._dbm.storesMixedCaseIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case quoted SQL identifiers as
 * case insensitive and stores them in mixed case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesMixedCaseQuotedIdentifiers = function(callback) {
  this._dbm.storesMixedCaseQuotedIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case unquoted SQL identifiers
 * as case insensitive and stores them in upper case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesUpperCaseIdentifiers = function(callback) {
  this._dbm.storesUpperCaseIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case quoted SQL identifiers as
 * case insensitive and stores them in upper case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.storesUpperCaseQuotedIdentifiers = function(callback) {
  this._dbm.storesUpperCaseQuotedIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports ALTER TABLE with add column.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsAlterTableWithAddColumn = function(callback) {
  this._dbm.supportsAlterTableWithAddColumn(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports ALTER TABLE with drop column.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsAlterTableWithDropColumn = function(callback) {
  this._dbm.supportsAlterTableWithDropColumn(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ANSI92 entry level SQL grammar.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsANSI92EntryLevelSQL = function(callback) {
  this._dbm.supportsANSI92EntryLevelSQL(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ANSI92 full SQL grammar
 * supported.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsANSI92FullSQL = function(callback) {
  this._dbm.supportsANSI92FullSQL(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ANSI92 intermediate SQL grammar
 * supported.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsANSI92IntermediateSQL = function(callback) {
  this._dbm.supportsANSI92IntermediateSQL(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports batch updates.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if this database supports batch upcates; false otherwise
 */
DatabaseMetaData.prototype.supportsBatchUpdates = function(callback) {
  this._dbm.supportsBatchUpdates(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog name can be used in a data manipulation
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCatalogsInDataManipulation = function(callback) {
  this._dbm.supportsCatalogsInDataManipulation(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog name can be used in an index definition
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCatalogsInIndexDefinitions = function(callback) {
  this._dbm.supportsCatalogsInIndexDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog name can be used in a privilege definition
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCatalogsInPrivilegeDefinitions = function(callback) {
  this._dbm.supportsCatalogsInPrivilegeDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog name can be used in a procedure call statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCatalogsInProcedureCalls = function(callback) {
  this._dbm.supportsCatalogsInProcedureCalls(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a catalog name can be used in a table definition
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCatalogsInTableDefinitions = function(callback) {
  this._dbm.supportsCatalogsInTableDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports column aliasing.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsColumnAliasing = function(callback) {
  this._dbm.supportsColumnAliasing(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the JDBC scalar function CONVERT
 * for the conversion of one JDBC type to another, or between the JDBC types
 * fromType and toType if both are given.
 *
 * @param {Number} [fromType] - The type to convert from; one of the type codes from the class java.sql.Types
 * @param {Number} [toType] - The type to convert to; one of the type codes from the class java.sql.Types
 * @param {Function} callback
 * @returns {Boolean}  Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsConvert = function(fromType, toType, callback) {
  var validParams = (
    _.isInteger(fromType) &&
    _.isInteger(toType)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.supportsConvert(fromType, toType, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ODBC Core SQL grammar.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCoreSQLGrammar = function(callback) {
  this._dbm.supportsCoreSQLGrammar(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports correlated subqueries.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsCorrelatedSubqueries = function(callback) {
  this._dbm.supportsCorrelatedSubqueries(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports both data definition and data
 * manipulation statements within a transaction.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsDataDefinitionAndDataManipulationTransactions = function(callback) {
  this._dbm.supportsDataDefinitionAndDataManipulationTransactions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports only data manipulation statements
 * within a transaction.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsDataManipulationTransactionsOnly = function(callback) {
  this._dbm.supportsDataManipulationTransactionsOnly(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether, when table correlation names are supported, they are
 * restricted to being different from the names of the tables.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsDifferentTableCorrelationNames = function(callback) {
  this._dbm.supportsDifferentTableCorrelationNames(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports expressions in ORDER BY lists.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsExpressionsInOrderBy = function(callback) {
  this._dbm.supportsExpressionsInOrderBy(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ODBC Extended SQL grammar.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsExtendedSQLGrammar = function(callback) {
  this._dbm.supportsExtendedSQLGrammar(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports full nested outer joins.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsFullOuterJoins = function(callback) {
  this._dbm.supportsFullOuterJoins(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether auto-generated keys can be retrieved after a statement has
 * been executed
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsGetGeneratedKeys = function(callback) {
  this._dbm.supportsGetGeneratedKeys(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports some form of GROUP BY clause.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsGroupBy = function(callback) {
  this._dbm.supportsGroupBy(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports using columns not included in the
 * SELECT statement in a GROUP BY clause provided that all of the columns in
 * the SELECT statement are included in the GROUP BY clause.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsGroupByBeyondSelect = function(callback) {
  this._dbm.supportsGroupByBeyondSelect(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports using a column that is not in the
 * SELECT statement in a GROUP BY clause.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsGroupByUnrelated = function(callback) {
  this._dbm.supportsGroupByUnrelated(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the SQL Integrity Enhancement
 * Facility.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsIntegrityEnhancementFacility = function(callback) {
  this._dbm.supportsIntegrityEnhancementFacility(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports specifying a LIKE escape clause.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsLikeEscapeClause = function(callback) {
  this._dbm.supportsLikeEscapeClause(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database provides limited support for outer joins.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsLimitedOuterJoins = function(callback) {
  this._dbm.supportsLimitedOuterJoins(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the ODBC Minimum SQL grammar.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMinimumSQLGrammar = function(callback) {
  this._dbm.supportsMinimumSQLGrammar(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case unquoted SQL identifiers
 * as case sensitive and as a result stores them in mixed case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMixedCaseIdentifiers = function(callback) {
  this._dbm.supportsMixedCaseIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database treats mixed case quoted SQL identifiers as
 * case sensitive and as a result stores them in mixed case.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMixedCaseQuotedIdentifiers = function(callback) {
  this._dbm.supportsMixedCaseQuotedIdentifiers(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether it is possible to have multiple ResultSet objects returned
 * from a CallableStatement object simultaneously.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMultipleOpenResults = function(callback) {
  this._dbm.supportsMultipleOpenResults(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports getting multiple ResultSet objects
 * from a single call to the method execute.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMultipleResultSets = function(callback) {
  this._dbm.supportsMultipleResultSets(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database allows having multiple transactions open at
 * once (on different connections).
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsMultipleTransactions = function(callback) {
  this._dbm.supportsMultipleTransactions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports named parameters to callable
 * statements.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsNamedParameters = function(callback) {
  this._dbm.supportsNamedParameters(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether columns in this database may be defined as non-nullable.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsNonNullableColumns = function(callback) {
  this._dbm.supportsNonNullableColumns(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports keeping cursors open across
 * commits.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOpenCursorsAcrossCommit = function(callback) {
  this._dbm.supportsOpenCursorsAcrossCommit(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports keeping cursors open across
 * rollbacks.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOpenCursorsAcrossRollback = function(callback) {
  this._dbm.supportsOpenCursorsAcrossRollback(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports keeping statements open across
 * commits.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOpenStatementsAcrossCommit = function(callback) {
  this._dbm.supportsOpenStatementsAcrossCommit(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports keeping statements open across
 * rollbacks.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOpenStatementsAcrossRollback = function(callback) {
  this._dbm.supportsOpenStatementsAcrossRollback(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports using a column that is not in the
 * SELECT statement in an ORDER BY clause.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOrderByUnrelated = function(callback) {
  this._dbm.supportsOrderByUnrelated(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports some form of outer join.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsOuterJoins = function(callback) {
  this._dbm.supportsOuterJoins(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports positioned DELETE statements.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsPositionedDelete = function(callback) {
  this._dbm.supportsPositionedDelete(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports positioned UPDATE statements.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsPositionedUpdate = function(callback) {
  this._dbm.supportsPositionedUpdate(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the given concurrency type in
 * combination with the given result set type.
 *
 * @param {Number} type - Defined in java.sql.ResultSet
 * @param {Number} concurrency - Type defined in java.sql.ResultSet
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsResultSetConcurrency = function(type, concurrency, callback) {
  var validParams = (
    _.isInteger(type) &&
    _.isInteger(concurrency)
  );

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.supportsResultSetConcurrency(type, concurrency, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the given result set holdability.
 *
 * @param {Number} holdability - one of the following constants: ResultSet.HOLD_CURSORS_OVER_COMMIT or ResultSet.CLOSE_CURSORS_AT_COMMIT
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so, false otherwise
 */
DatabaseMetaData.prototype.supportsResultSetHoldability = function(holdability, callback) {
  var validParams = _.isInteger(holdability);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.supportsResultSetHoldability(holdability, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the given result set type.
 *
 * @param {Number} type - defined in java.sql.ResultSet
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so, false otherwise
 */
DatabaseMetaData.prototype.supportsResultSetType = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.supportsResultSetType(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports savepoints.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSavepoints = function(callback) {
  this._dbm.supportsSavepoints(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a schema name can be used in a data manipulation
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSchemasInDataManipulation = function(callback) {
  this._dbm.supportsSchemasInDataManipulation(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a schema name can be used in an index definition
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSchemasInIndexDefinitions = function(callback) {
  this._dbm.supportsSchemasInIndexDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a schema name can be used in a privilege definition
 * statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSchemasInPrivilegeDefinitions = function(callback) {
  this._dbm.supportsSchemasInPrivilegeDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a schema name can be used in a procedure call statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSchemasInProcedureCalls = function(callback) {
  this._dbm.supportsSchemasInProcedureCalls(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether a schema name can be used in a table definition statement.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSchemasInTableDefinitions = function(callback) {
  this._dbm.supportsSchemasInTableDefinitions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports SELECT FOR UPDATE statements.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSelectForUpdate = function(callback) {
  this._dbm.supportsSelectForUpdate(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports statement pooling.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsStatementPooling = function(callback) {
  this._dbm.supportsStatementPooling(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports invoking user-defined or vendor
 * functions using the stored procedure escape syntax.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsStoredFunctionsUsingCallSyntax = function(callback) {
  this._dbm.supportsStoredFunctionsUsingCallSyntax(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports stored procedure calls that use the
 * stored procedure escape syntax.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsStoredProcedures = function(callback) {
  this._dbm.supportsStoredProcedures(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports subqueries in comparison
 * expressions.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSubqueriesInComparisons = function(callback) {
  this._dbm.supportsSubqueriesInComparisons(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports subqueries in EXISTS expressions.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSubqueriesInExists = function(callback) {
  this._dbm.supportsSubqueriesInExists(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports subqueries in IN expressions.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSubqueriesInIns = function(callback) {
  this._dbm.supportsSubqueriesInIns(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports subqueries in quantified
 * expressions.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsSubqueriesInQuantifieds = function(callback) {
  this._dbm.supportsSubqueriesInQuantifieds(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports table correlation names.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsTableCorrelationNames = function(callback) {
  this._dbm.supportsTableCorrelationNames(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports the given transaction isolation
 * level.
 *
 * @param {Number} level - one of the transaction isolation levels defined in java.sql.Connection
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so, false otherwise
 */
DatabaseMetaData.prototype.supportsTransactionIsolationLevel = function(level, callback) {
  var validParams = _.isInteger(level);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.supportsTransactionIsolationLevel(level, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports transactions.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsTransactions = function(callback) {
  this._dbm.supportsTransactions(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports SQL UNION.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsUnion = function(callback) {
  this._dbm.supportsUnion(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database supports SQL UNION ALL.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.supportsUnionAll = function(callback) {
  this._dbm.supportsUnionAll(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether or not a visible row update can be detected by calling the
 * method ResultSet.rowUpdated.
 *
 * @param {Number} type - the ResultSet type; one of ResultSet.TYPE_FORWARD_ONLY, ResultSet.TYPE_SCROLL_INSENSITIVE, or ResultSet.TYPE_SCROLL_SENSITIVE
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if changes are detected by the result set type; false otherwise
 */
DatabaseMetaData.prototype.updatesAreDetected = function(type, callback) {
  var validParams = _.isInteger(type);

  if(! validParams) {
    return callback(new Error('INVALID ARGUMENTS'));
  }

  this._dbm.updatesAreDetected(type, function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database uses a file for each table.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.usesLocalFilePerTable = function(callback) {
  this._dbm.usesLocalFilePerTable(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

/**
 * Retrieves whether this database stores tables in a local file.
 *
 * @param {Function} callback
 * @returns {Boolean} Via callback: true if so; false otherwise
 */
DatabaseMetaData.prototype.usesLocalFiles = function(callback) {
  this._dbm.usesLocalFiles(function(err, result) {
    if (err) {
      return callback(err);
    }
    return callback(null, result);
  });
};

jinst.events.once('initialized', function onInitialized() {
  // See https://docs.oracle.com/javase/7/docs/api/java/sql/DatabaseMetaData.html
  // for full documentation for static attributes
  var staticAttrs = [
    'attributeNoNulls', 'attributeNullable', 'attributeNullableUnknown',
    'bestRowNotPseudo', 'bestRowPseudo', 'bestRowSession', 'bestRowTemporary',
    'bestRowTransaction', 'bestRowUnknown', 'columnNoNulls', 'columnNullable',
    'columnNullableUnknown', 'functionColumnIn', 'functionColumnInOut',
    'functionColumnOut', 'functionColumnResult', 'functionColumnUnknown',
    'functionNoNulls', 'functionNoTable', 'functionNullable',
    'functionNullableUnknown', 'functionResultUnknown', 'functionReturn',
    'functionReturnsTable', 'importedKeyCascade',
    'importedKeyInitiallyDeferred', 'importedKeyInitiallyImmediate',
    'importedKeyNoAction', 'importedKeyNotDeferrable', 'importedKeyRestrict',
    'importedKeySetDefault', 'importedKeySetNull', 'procedureColumnIn',
    'procedureColumnInOut', 'procedureColumnOut', 'procedureColumnResult',
    'procedureColumnReturn', 'procedureColumnUnknown', 'procedureNoNulls',
    'procedureNoResult', 'procedureNullable', 'procedureNullableUnknown',
    'procedureResultUnknown', 'procedureReturnsResult', 'sqlStateSQL',
    'sqlStateSQL99', 'sqlStateXOpen', 'tableIndexClustered',
    'tableIndexHashed', 'tableIndexOther', 'tableIndexStatistic', 'typeNoNulls',
    'typeNullable', 'typeNullableUnknown', 'typePredBasic', 'typePredChar',
    'typePredNone', 'typeSearchable', 'versionColumnNotPseudo',
    'versionColumnPseudo', 'versionColumnUnknown',
  ];

  staticAttrs.forEach(function(attr) {
    DatabaseMetaData[attr] = java.getStaticFieldValue('java.sql.DatabaseMetaData', attr);
  });
});

module.exports = DatabaseMetaData;
