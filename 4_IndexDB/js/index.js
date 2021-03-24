$(document).ready(function () {
            debugger;
            var request, db;
            $('#prImage').on('change', bindImage);
            // Code for declare database and check browser capibility
            if (!window.indexedDB) {
                console.log("Your Browser does not support IndexedDB");
            }
            else {
                request = window.indexedDB.open("myTestDB", 25);
                request.onerror = function (event) {
                    console.log("Error opening DB", event);
                }
                request.onupgradeneeded = function (event) {
                    console.log("Upgrading");
                    db = event.target.result;
                    var objectStore = db.createObjectStore("students", { keyPath: "rollNo", autoIncrement: true });

                }
                request.onsuccess = function (event) {
                    console.log("Success opening DB");
                    db = event.target.result;
                    showAllDataMethod();
                }
            }
            // Code for Read Data from Indexed on for edit(Single Record)
            $('#btnShow').click(function () {
                debugger;
                var id = parseInt($('#txtSearch').val());
                var request = db.transaction(["students"], "readonly").objectStore("students").get(id);
                request.onsuccess = function (event) {
                    var r = request.result;
                    console.log(r);
                    if (r != null) {
                        $('#firstName').val(r.FirstName);
                        $('#lastName').val(r.LastName);
                        $('#city').val(r.City);
                        $('#mobile').val(r.Mobile);
                        $('#holdImg').attr('src', r.File);
                    } else {
                        ClearTextBox();
                        alert('Record Does not exist');
                    }

                };
            });

            // Code for Clear text Box
            $('#clearBtn').click(function () {
                ClearTextBox();

            });
            function ClearTextBox() {
                $('#firstName').val('');
                $('#lastName').val('');
                $('#city').val('');
                $('#mobile').val('');
                $('#txtSearch').val('');
                $('#holdImg').attr('src', 'images/placeholder.png');
            }
            // Code for Update record on IndexedDB
            $('#updateBtn').click(function () {

                var rollNo = parseInt($('#txtSearch').val());
                var firstName = $('#firstName').val();
                var lastName = $('#lastName').val();
                var city = $('#city').val();
                var mobile = $('#mobile').val();
                var img = new Image();
                img.src = $('#holdImg').attr('src');
                var image = img.src;
                var transaction = db.transaction(["students"], "readwrite");
                var objectStore = transaction.objectStore("students");
                var request = objectStore.get(rollNo);
                request.onsuccess = function (event) {

                    request.result.FirstName = firstName;
                    request.result.LastName = lastName;
                    request.result.City = city;
                    request.result.Mobile = mobile;
                    request.result.File = image;
                    objectStore.put(request.result);
                    alert('Recored Updated Successfully !!!');
                    showAllDataMethod();
                    ClearTextBox();
                };
            });
            //Code for Deleting record from indexedDB
            $('#deleteBtn').click(function () {
                var id = parseInt($('#txtSearch').val());
                db.transaction(["students"], "readwrite").objectStore("students").delete(id);
                alert(' Recored No. ' + id + ' Deleted Successfully !!!');
                showAllDataMethod();
                ClearTextBox();
            });
            $('#btnShowAll').click(function () {
                //Calling funtin for show all data from IndexedDB
                showAllDataMethod();
            });

            $('#btnShowAll').click(function () {
                init()
            });
            function init() {
                $('#pictureTest').on('change', bindImage);
                $('#addBtn').on('click', function (e) {
                    e.preventDefault();
                    ns.save();
                });
                $('#clearBtn').on('click', ns.clearProduct);
                ns.display();
            }
            function bindImage(e) {
                var file = e.originalEvent.target.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (evt) {
                    var result = evt.target.result;
                    $('#testImage').removeAttr('src');
                    $('#testImage').attr('src', result);
                }
            }

            $('#addBtn').on('click', function (e) {
                e.preventDefault();
                var img = new Image();
                var firstName = $('#firstName').val();
                var lastName = $('#lastName').val();
                var city = $('#city').val();
                var mobile = $('#mobile').val();
                img.src = $('#holdImg').attr('src');
                var image = img.src;
                var transaction = db.transaction(["students"], "readwrite");

                var objectStore = transaction.objectStore("students");
                objectStore.add({ FirstName: firstName, LastName: lastName, City: city, Mobile: mobile, File: image });

                transaction.oncomplete = function (event) {
                    console.log("Success :)");
                    $('#result').html("Add: Successfully");
                };
                transaction.onerror = function (event) {
                    console.log("Error :)");
                    $('#result').html("Add: Error occurs in inserting");
                };
                showAllDataMethod();
                ClearTextBox();
            });
       
            function showAllDataMethod() {
                var request = db.transaction(["students"], "readonly").objectStore("students").getAll();
                request.onsuccess = function (event) {
                    var image = new Image();
                    var record = event.target.result;
                    console.log('get success', record);
                    image.src = 'data:image/jpeg;base64,' + btoa(record.File);
                    var obj = request.result
                    var table = '<table class="table table-responsive table-bordered table-striped"><thead> <th>ID</th> <th>First Name</th> <th>Last Name</th>  <th>Email Address</th> <th>Mobile</th> <th>Image</th> </thead><tbody>';
                    $.each(obj, function () {
                        table += '<tr class="table-primary"><td>' + this['rollNo'] + '</td> <td>' + this['FirstName'] + '</td>  <td>' + this['LastName'] + '</td>  <td>' + this['City'] + '</td>  <td>' + this['Mobile'] + '</td> <td> <img width="80" height="80" src="' + this['File'] +'" /> + </td></tr>';
                    });
                    table += '</tbody></table>';
                    $("#datalist").html(table);
                };
            }
        });