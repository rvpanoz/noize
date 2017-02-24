module.exports = {

  /**
   * converts any javascript variable to its JSON representation
   * @param {Object} obj
   * @returns {String}
   * */
  encode: function (obj, replacer, space) {
    return JSON.stringify(obj, replacer, space);
  },
  /**
   * parses a JSON string to its object representation
   * @param {String} str
   * @returns {Object}
   */
  decode: function (str) {
    return JSON.parse(str);
  },
  /**
   *
   * @return {undefined}
   */
  toJSON: function (obj) {
    return JSON.stringify(obj);
  },
  /**
   *
   * @returns {Object}
   */
  callServer: (opts) => {
    var scope = opts.scope;
    var params = opts.params || {};

    function doCallbacks(result) {

      try {
        if (opts.callback)
          opts.callback.call(scope, result, opts);
        if (result.success && opts.success)
          opts.success.call(scope, result, opts);
        if (!result.success && opts.failure)
          opts.failure.call(scope, result, opts);
        if (!result.success && !opts.aborted && opts.alerts !== false)
          alert(result.errors.name);
      } catch (e) {
        alert(e);
      }
    }
    var cd = !!opts.crossDomain;
    var ajaxOpts = _.extend({
      url: opts.url,
      type: cd ? 'GET' : 'POST',
      contentType: cd ? null : 'application/json',
      data: JSON.stringify(params),
      processData: cd,
      dataType: cd ? 'jsonp' : 'json',
      success: doCallbacks,
      error: function (req, err, ex) {
        if (opts.alerts !== false && !lib.shutdown && !opts.aborted) alert('Ajax Error ' + err + ' ' + ex);
      },
      complete: function () {
        delete opts.xhr;
      }
    }, opts.ajaxOpts);

    return $.ajax(ajaxOpts);
  }
}
