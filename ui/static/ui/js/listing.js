define(['jquery', 'bootstrap', 'icheck', 'csrf'], function(jQuery) {
  'use strict';

  /* global $ */

  function formatGroupName(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string.substring(0, string.length - 1);
  }

  function isMITEmail(kerberosId) {
    var email = kerberosId + '@mit.edu';
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  function formatUserGroups(userList, dest) {
    var $dest = $(dest);
    for (var i = 0; i < userList.length; i++) {
      $dest.append(
        '<div class="row">\n' +
          '<div class="col-sm-7">\n' +
            '<div class="cd-panel-members-list-username">' +
              userList[i].username + '@mit.edu</div>\n' +
          '</div>\n' +
          '<div class="col-sm-3">\n' +
            '<div class="cd-panel-members-list-group_type">' +
              formatGroupName(userList[i].group_type) + '</div>\n' +
          '</div>\n' +
          '<div class="col-sm-2">\n' +
            '<button ' +
               'class="btn btn-default cd-panel-members-remove" ' +
               'data-username="' + userList[i].username + '" ' +
               'data-group_type="' + userList[i].group_type + '">\n' +
               '<i class="fa fa-minus"></i>\n' +
            '</button>\n' +
          '</div>\n' +
        '</div>\n');
    }
  }

  function resetUserGroupForm() {
    $('input[name=\'members-username\']').val('');
    $('select[name=\'members-group_type\']').prop('selectedIndex', 0);
  }

  function showMembersAlert(message, mtype) {
    //default value for mtype
    mtype = typeof mtype !== 'undefined' ? mtype : 'success';
    //reset all the classes
    $('#members-alert').html(
      '<div class="alert alert-' + mtype +
          ' fade in out" data-alert="alert">\n' +
        '<a href="#" class="close" data-dismiss="alert" ' +
          'aria-label="close">&times;</a>\n' + message + '\n' +
      '</div>');
  }

  function showUpdateAllMembers() {
    //retrieve all the members
    var url = $('.cd-panel-members').data('members-url');
    $('#cd-panel-members-list').empty();
    $.ajax({url: url})
      .done(function(data) {
        formatUserGroups(data.results, '#cd-panel-members-list');
      })
      .error(function() {
        var message = 'Impossible to retrieve list of members.';
        showMembersAlert(message, 'danger');
      });
  }

  jQuery(document).ready(function($) {
    $('input.icheck-11').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue'
    });
    $('[data-toggle=popover]').popover();

    //open the lateral panel for resources
    $('.cd-btn').on('click', function(event) {
      event.preventDefault();
      var url = $(this).attr('href');
      var title = $(this).html();
      var textarea = $('.cd-panel .textarea-xml');
      $('.cd-panel header h1').html(title);

      // Clear out text area while waiting for AJAX to return
      textarea.val('');
      $.ajax({url: url, dataType: 'text'}).done(function(data) {
        $('.cd-panel .textarea-xml').val(data);
      }).error(function() {
        $('.cd-panel .textarea-xml').val('Unable to retrieve XML.');
      });
      $('.cd-panel').addClass('is-visible');
    });

    // Handle "Select XML"
    $('.cd-panel #copy-textarea-xml').on('click', function(event) {
      event.preventDefault();
      $('.cd-panel .textarea-xml').select();
    });
    //close the lateral panel
    $('.cd-panel').on('click', function(event) {
      if ($(event.target).is('.cd-panel') ||
          $(event.target).is('.cd-panel-close')) {
        $('.cd-panel').removeClass('is-visible');
        event.preventDefault();
      }
    });

    //open the lateral panel
    $('.btn-taxonomies').on('click', function(event) {
      event.preventDefault();
      $('.cd-panel-2').addClass('is-visible');
    });

    //close the lateral panel
    $('.cd-panel-2').on('click', function(event) {
      if ($(event.target).is('.cd-panel-2') ||
          $(event.target).is('.cd-panel-close')) {
        $('.cd-panel-2').removeClass('is-visible');
        event.preventDefault();
      }
    });

    //open the lateral panel for members
    $('.btn-members').on('click', function(event) {
      event.preventDefault();
      //remove any alert
      $('#members-alert').empty();
      //reset the form values
      resetUserGroupForm();
      //make panel visible
      $('.cd-panel-members').addClass('is-visible');
      //retrieve all the members
      showUpdateAllMembers();
      //
    });
    //close the lateral panel for members
    $('.cd-panel-members').on('click', function(event) {
      if ($(event.target).is('.cd-panel-members') ||
          $(event.target).is('.cd-panel-close')) {
        $('.cd-panel-members').removeClass('is-visible');
        event.preventDefault();
      }
    });
    //add button for the members
    $(document).on('click', '.cd-panel-members-add', function() {
      var url = $('.cd-panel-members').data('members-url');
      var username = $('input[name=\'members-username\']').val();
      var groupType = $('select[name=\'members-group_type\']').val();
      // /api/v1/repositories/my-rep/members/groups/<group_type>/users/
      url += 'groups/' + groupType + '/users/';
      if (!isMITEmail(username)) {
        var message = '<strong>' + username +
          '@mit.edu</strong> does not seem to be a valid email';
        showMembersAlert(message, 'danger');
        return;
      }
      $.ajax({
        url: url,
        type: 'POST',
        data: {username: username}
      })
      .done(function() {
        //reset the values
        resetUserGroupForm();
        //show alert
        var message = '<strong>' + username +
          '@mit.edu</strong> successfully added to group <strong>' +
          formatGroupName(groupType) + '</strong>';
        showMembersAlert(message);
        //retrieve the members lists
        showUpdateAllMembers();
      })
      .error(function(data) {
        //show alert
        var message = 'Error trying to add user ' + username +
          '@mit.edu to group ' + formatGroupName(groupType);
        message = message + '<br>' + data.responseJSON.username[0];
        showMembersAlert(message, 'danger');
      });
    });
    //remove button for the members
    $(document).on('click', '.cd-panel-members-remove', function() {
      var url = $('.cd-panel-members').data('members-url');
      var username = $(this).data('username');
      var groupType = $(this).data('group_type');
      // /api/v1/repositories/my-rep/members/groups/<group_type>/users/<username>/
      url += 'groups/' + groupType + '/users/' + username + '/';
      $.ajax({
        url: url,
        type: 'DELETE'
      })
      .done(function() {
        //show alert
        var message = '<strong>' + username +
          '@mit.edu</strong> successfully deleted from group <strong>' +
          formatGroupName(groupType) + '</strong>';
        showMembersAlert(message);
        //retrieve the members lists
        showUpdateAllMembers();
      })
      .error(function(data) {
        //show alert
        var message = 'Error trying to delete user <strong>' +
          username + '@mit.edu</strong> from group <strong>' +
          formatGroupName(groupType) + '</strong>';
        try {
          message += '<br>' + data.responseJSON.detail;
        }
        catch (err) {}
        showMembersAlert(message, 'danger');
      });
    });
  });
});
