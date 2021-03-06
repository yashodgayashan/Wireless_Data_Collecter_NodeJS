const sql = require('../config/db.config');

const Node = function (node) {
  this.parentNodeId = node.parentNodeId;
  this.createdUserId = node.createdUserId;
  this.disabled = node.disabled;
  this.lastModifiedUser = node.lastModifiedUser;
  this.lastModifiedDateTime = node.lastModifiedDateTime;
};

// create and save new node
Node.create = (newNode, result) => {
  sql.query('INSERT INTO node SET ?', newNode, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }
    
    if (debug) console.log('Created node: ', { id: res.insertId, ...newNode });
    result(null, { id: res.insertId, ...newNode });
  });
};

// get all nodes from database
Node.getAll = (result) => {
  sql.query('SELECT * FROM node', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Nodes: ', res);
    result(null, res);
    return
  });
};

// get node by id
Node.findById = (nodeId, result) => {
  sql.query('SELECT * FROM node WHERE nodeId =' + nodeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.length) {
      if (debug) console.log('Found node: ', res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: 'not_found' }, null);
  });
};

// update a node
Node.updateById = (nodeId, node, result) => {
  sql.query('UPDATE node SET parentNodeId = ?, createdUserId = ?, disabled = ?, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE nodeId = ?', [node.parentNodeId, node.createdUserId, node.disabled, node.lastModifiedUser, node.lastModifiedDateTime, nodeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Updated node: ', { id: nodeId, ...node });
    result(null, { id: nodeId, ...node });
  });
};

// delete a node by id
Node.remove = (nodeId, result) => {
  sql.query('DELETE FROM node WHERE nodeId = ?', nodeId, (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Deleted node with id: ', nodeId);
    result(null, res);
  });
};

// delete all nodes
Node.removeAll = result => {
  sql.query('DELETE FROM node', (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (debug) console.log('Deleted %s nodes.', res.affectedRows);
    result(null, res);
  });
};

// disable a node
Node.disable = (nodeId, node, result) => {
  sql.query('UPDATE node SET disabled = 1, lastModifiedUser = ?, lastModifiedDateTime = ? WHERE nodeId = ?', [node.lastModifiedUser, node.lastModifiedDateTime, nodeId], (err, res) => {
    if (err) {
      if (debug) console.log('Error: ', err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: 'not_found' }, null);
      return;
    }

    if (debug) console.log('Disabled node: ', { id: nodeId });
    result(null, { id: nodeId });
  })
};

module.exports = Node;