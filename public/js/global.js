//dom ready
$(document).ready(function() {
    populateTable();
});

function populateTable() {
    var tableContent = '';

    $.getJSON('/list', function(data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        var i = 0;
        $.each(data, function() {
            i++;
            tableContent += '<tr>';
            tableContent += '<td>' + i + '</td>';
            tableContent += '<td>' + this.subject + '</td>';
            tableContent += '<td>' + this.content + '</td>';
            tableContent += '<td><form action="/edit" method="put">';
            tableContent += '<input type="hidden" name="id" value="<%=items[i]._id%>">';
            tableContent += '<input type="submit" name="submit" value="Edit">';
            tableContent += '</form></td>';
            tableContent += '<td><form action="/delete/<%=items[i]._id%>" method="delete">';
            tableContent += '<input type="submit" name="submit" value="Delete">';
            tableContent += '</form></td>';
            tableContent += '</tr>';
        });

        $('#list table tbody').html(tableContent);
    });
};
