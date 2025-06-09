const queryStrings = {
  CREATE_TABLES: "CREATE TABLE IF NOT EXISTS visitors \
     (\
        id SERIAL PRIMARY KEY, \
        name VARCHAR(20) NOT NULL, \
        age INTEGER NOT NULL, \
        date_of_visit DATE NOT NULL, \
        time_of_visit TIME NOT NULL, \
        assistor_name VARCHAR(20) NOT NULL, \
        comments VARCHAR(200)\
     )",

  ADD_NEW_VISITOR: "INSERT INTO visitors \
    (\
      name, age, \
      date_of_visit, \
      time_of_visit, \
      assistor_name, \
      comments\
    ) \
    VALUES ($1, $2, $3, $4, $5, $6) \
    RETURNING *",

  LIST_ALL_USERS: "SELECT \
      id, name \
     FROM visitors;",

  DELETE_A_VISITOR: "DELETE FROM visitors \
    WHERE id=$1 \
    RETURNING *",

  updateVisitor: (id, columnName, columnValue) =>
    `UPDATE visitors 
     SET ${columnName} = '${columnValue}'
     WHERE id=${id}
     RETURNING *`,

  GET_A_VISITOR: "SELECT * \
     FROM visitors \
     WHERE id=$1;",

  GET_LATEST_VISITOR: "WITH latest_date_record AS \
      (   \
        SELECT MAX(date_of_visit) \
        AS max_date FROM visitors\
      )\
    SELECT id FROM visitors \
    WHERE date_of_visit = \
      (\
        SELECT max_date \
        FROM latest_date_record\
      ) \
    ORDER BY time_of_visit DESC;",

  DELETE_ALL_VISITORS: "WITH deleted_rows \
     AS ( \
     DELETE FROM visitors\
     RETURNING *\
     )\
     SELECT COUNT(*) AS number_of_deleted_rows \
     FROM deleted_rows;",
};

module.exports = {
  queryStrings
};
