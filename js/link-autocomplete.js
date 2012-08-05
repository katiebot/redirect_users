(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocompleteLink = {
  attach: function (context, settings) {
    
    $('input.link-autocomplete').once('link-autocomplete', function() {
      $(this).unbind(); // removes Drupal default autocomplete events
      $('#' + this.id + '-autocomplete').removeClass('autocomplete-processed'); // remove the process class, since we're going to reprocess this element. Wee!
    });
    
    //* reprocess elements to add our own link field autocomplete
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsACLink($input, acdb[uri]);
    });
    // */
  }
};

Drupal.jsACLink = function ($input, db) {
  var object = new Drupal.jsAC($input, db); // re-use Drupal's autocomplete code
  
  // override the .select, .hidePopup and .found methods in order to support autocompleting both the title and url fields
  object.select = function (node) {
    this.input.value = $(node).data('autocompleteUrl');
    //$('#' + this.input.id.substr(0, this.input.id.length - 6) + '-url').val($(node).data('autocompleteNode'));
  };
  
  object.hidePopup = function (keycode) {
    // Select item if the right key or mousebutton was pressed.
    // Populate the title and fill in the node/## URL
    if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
      this.input.value = $(this.selected).data('autocompleteNode');
      $('#' + this.input.id.substr(0, this.input.id.length - 6) + '-url').val($(this.selected).data('autocompleteNode'));
    }
    // Hide popup.
    var popup = this.popup;
    if (popup) {
      this.popup = null;
      $(popup).fadeOut('fast', function () { $(popup).remove(); });
    }
    this.selected = false;
    $(this.ariaLive).empty();
  };
  
  object.found = function (matches) {
    // If no value in the textfield, do not show the popup.
    if (!this.input.value.length) {
      return false;
    }
  
    // Prepare matches.
    var ul = $('<ul></ul>');
    var ac = this;
    for (key in matches) {
      $('<li></li>')
        .html($('<div></div>').html(matches[key]['display']))
        .mousedown(function () { ac.select(this); })
        .mouseover(function () { ac.highlight(this); })
        .mouseout(function () { ac.unhighlight(this); })
        .data('autocompleteNode', key)
        .data('autocompleteUrl', matches[key]['title'])
        .appendTo(ul);
    }
  
    // Show popup with matches, if any.
    if (this.popup) {
      if (ul.children().size()) {
        $(this.popup).empty().append(ul).show();
        $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
      }
      else {
        $(this.popup).css({ visibility: 'hidden' });
        this.hidePopup();
      }
    }
  };
  
};


})(jQuery);