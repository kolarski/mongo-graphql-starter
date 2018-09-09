export default {
  Root: {
    queryPreprocess(root: any, args: any, context: any, ast: any) {
      //Called before query filters are processed
    },
    queryMiddleware(queryPacket: any, root: any, args: any, context: any, ast): any {
      //Called after query filters are processed, which are passed in queryPacket
    },
    queryPreAggregate(aggregateItems: any, root: any, args: any, context: any, ast: any) {
      //Called right before a Mongo aggregation is performed
    },
    beforeInsert(objToBeInserted: any, root: any, args: any, context: any, ast: any) {
      //Called before an insertion occurs. Return false to cancel it
    },
    afterInsert(newObj: any, root: any, args: any, context: any, ast: any) {
      //Called after an object is inserted
    },
    beforeUpdate(match: any, updates: any, root: any, args: any, context: any, ast: any) {
      //Called before an update occurs. Return false to cancel it
    },
    afterUpdate(match: any, updates: any, root: any, args: any, context: any, ast: any) {
      //Called after an update occurs. The filter match, and updates objects will be
      //passed into the first two parameters, respectively
    },
    beforeDelete(match: any, root: any, args: any, context: any, ast: any) {
      //Called before a deletion. Return false to cancel it.
    },
    afterDelete(match: any, root: any, args: any, context: any, ast: any) {
      //Called after a deltion. The filter match will be passed into the first parameter.
    },
    adjustResults(results: any) {
      //Called anytime objects are returned from a graphQL endpoint. Use this hook to make adjustments to them.
    }
  }
};
