///<reference path="js/jquery-3.2.1.min.js"/>
$(document).ready(function(){	
	employeeNamespace.init();
});

(function(){
	this.employeeNamespace = this.employeeNamespace || {};
	var ns = this.employeeNamespace;
	var currentemployee;

	ns.init = function(){
		$('#prImage').on('change', bindImage);
		$('#addBtn').on('click', function(e){
			e.preventDefault();
			ns.save();
		});
		$('#clearBtn').on('click', ns.clearemployee);
		ns.display();
	}

	function bindImage(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(evt){
			var result = evt.target.result;
			$('#holdImg').removeAttr('src');
			$('#holdImg').attr('src', result);
		}
	}

	function employeeRetreive(){
		var allemployee = JSON.parse(localStorage.getItem('employees'));
		return allemployee ? allemployee : [];
	}

	ns.display = function (){
		currentemployee = {key:null, employee:{}};
		var results = employeeRetreive();
		bindToGrid(results);
	}

	function bindToGrid(results){
		var html='';
		for(var i = 0; i<results.length; i++){
			var employee = results[i];
			html +='<tr><td class="displayImg"><img class="img-responsive" src="'+employee.image+'"/></td>';
			html +='<td>'+employee.name+'</td>';
			html +='<td>'+employee.price+'</td>';
			html +='<td>'+employee.weight+'</td>';
			html +='<td>'+employee.brif+'</td>';
			html +='<td><a class="edit" href="javascript:void(0)" data-key="'+i+'"><i class="fa fa-edit"></i></a></td>';
			html +='<td><a class="delete" href="javascript:void(0)" data-key="'+i+'"><i class="fa fa-trash"></i></a></td></tr>';
		}
		html = html || '<tr><td colspan="7">No Records Available</td></tr>';
		$('#employeeTable').html('<table id="employeeTable" class="table table-responsive table-bordered">' +
							'<tr><th>Photo</th><th>Name</th><th>Student Id</th>' +
								'<th>Contact No</th><th>Email</th><th>Edit</th><th>Delete</th>' +
							'</tr></table>');
		$('#employeeTable').append(html);
		$('a.edit').on('click', ns.loademployee);
		$('a.delete').on('click', ns.deleteemployee);
	}

	ns.deleteemployee = function(){
		var key = parseInt($(this).attr('data-key')); 
		var results = employeeRetreive();
		$.each(results, function(index, obj){
	        results.splice(key,1);
	        localStorage.setItem('employees', JSON.stringify(results));
	        ns.display();
	        return false;
		});
	}

	ns.loademployee = function(){
		var key = parseInt($(this).attr('data-key'));
		var results = employeeRetreive();
		$('#headStatus, #addBtn').html('Update Student');
		$('.getImg-status').html('change image');
		currentemployee = {key:key, employee:results[key]};
		displayCurrentemployee();
	}

	function displayCurrentemployee(){
		var employee = currentemployee.employee;
		$('#stName').val(employee.name);
		$('#prPrice').val(employee.price);
		$('#prWeight').val(employee.weight);
		$('#prDes').val(employee.brif);
		$('#holdImg').attr('src', employee.image);
	}

	ns.save = function(){
		var img = new Image();
		var employee = currentemployee.employee;
		employee.name = $('#stName').val();
		employee.price = $('#prPrice').val();
		employee.weight = $('#prWeight').val();
		employee.brif = $('#prDes').val();
		img.src = $('#holdImg').attr('src');
		employee.image = img.src;

		var results = employeeRetreive();

		if(currentemployee.key != null){
		    results[currentemployee.key] = employee;
            localStorage.setItem('employees', JSON.stringify(results));
			clearInput();
			ns.display();
		}
		else {
			if(employee.name && employee.price && employee.weight){
				results.push(employee);
				localStorage.setItem('employees', JSON.stringify(results));
				clearInput();
				ns.display();
			}else{
				var html ='';
					html +='<p style="color:red;">Fill required Field(eg. employee Name, Price, Weight etc.)</p>';
				$('.employeeAdd-box').append(html);
			}
			
		}
		
	}

	function clearInput(){
		$('#stName').val('');
		$('#prPrice').val('');
		$('#prWeight').val('');
		$('#prDes').val('');
		$('#holdImg').attr('src','images/placeholder.png');
	}

	ns.clearemployee = function(){
		if(localStorage.length != 0){
			localStorage.clear();
			$("#employeeTable").find("tr:gt(0)").remove();
			ns.display();
		}
	}



})();