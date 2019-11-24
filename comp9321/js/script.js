document.addEventListener('DOMContentLoaded', function(){ 

		apiUrl = `http://0.0.0.0:3000` ;
	// for getting the user input values
	reaction = document.getElementById("reaction"),
	vision_val = document.getElementById("vision"),
	composure_val = document.getElementById("composure"),
	ballcontrol_val = document.getElementById("ball_control"),
	passing_val = document.getElementById("short_passing"),
	// for the reactions
	reaction.addEventListener("input", function() {
		var reaction_value =  reaction.value;
		reaction_html.innerHTML = parseInt(reaction_value);
	}, false); 

	// for vision
	vision_val.addEventListener("input", function() {
		var  vision_value = vision_val.value
		vision_html.innerHTML = parseInt(vision_value);
	}, false); 

	// for  composure
		composure_val.addEventListener("input", function() {
			var composure_value =  composure_val.value;
		    composure_html.innerHTML = parseInt(composure_value);
	}, false); 
		// for ball control
		ballcontrol_val.addEventListener("input", function() {
		var ball_control_value =  ballcontrol_val.value;
	    ballcontrol_html.innerHTML = parseInt(ball_control_value);
	}, false); 

	// for short passing
		passing_val.addEventListener("input", function() {
		var passing_value =  passing_val.value;
		// console.log(reaction_value);
	    shortpassing_html.innerHTML = parseInt(passing_value);
	}, false); 

// ----------------------------forfetching thousd players----------------//
var proxyUrl = 'https://cors-anywhere.herokuapp.com/';


document.getElementById("view_players").addEventListener("click", viewplayersfunction);

	function viewplayersfunction(e){
			var player = [];
		          const options_new ={
				        method :'GET',
				        body: JSON.stringify()
				    }
				     fetch(`${apiUrl}/player`,options_new)
					  .then(response => {
						       if (!response.ok) {
						           throw new Error("HTTP error " + response.status);
						       }
						       return response.json();
						   })
						 .then(json => {

						       this.users = json;
						       player.push(this.users)
						       for (i in player[0]){					       		
						       		// view_players_wrapper = document.getElementById("view_players")
						       		console.log(player[0][i])
						       }
						   })
            		 e.preventDefault();    
		      }
// 
// -------------for posting similar player request =------------------/

document.getElementById('fetch_players').onclick = closestfunction;

	


	function closestfunction(){
					// recomm_res = document.getElementById("recomm");
					var res = parseInt(reaction_html.innerHTML);
					var comp = parseInt(composure_html.innerHTML);
					var vis = parseInt(vision_html.innerHTML);
					var short = parseInt(shortpassing_html.innerHTML);
					var balls = parseInt(ballcontrol_html.innerHTML);
					 const user = {
							"Reactions"	:  res,
							"Composure"	: comp,
							"Vision"	: vis,
							"ShortPassing"	:short,
							"BallControl"	: balls
							}
					const options_new ={
				        method :'POST',
				        body: JSON.stringify(user)
				    }

				     fetch(`${apiUrl}/overall`,options_new)
				       .then(res => res.json())
				       .then(json =>myfunc(json))
  							  function myfunc(jsons){
  							  	var div_1 = document.getElementById('view_players');
  							  	div_1.innerHTML += jsons.Overall_Rating;

  							  	// implementation of getting closest player
 																
			  						fetch(`${apiUrl}/closest`,options_new)
							       .then(res_1 => res_1.json())
							       .then(jsonz =>myfunc(jsonz))
			  							  function myfunc(jsonz){
			  							  	for (j in jsonz){
			  							  		// console.log(j)
			  							  var recomm_res = document.getElementById('recomm');
  							  						recomm_res.innerHTML += jsonz.Closest_Player;
			  							  	}
			  							  	// console.log(jsonz)
			  							  }
			  							  	// var div_1 = document.getElementById('view_players');
			  							  	// div_1.innerHTML += jsons.Overall_Rating;
  							  	// ------------------------





  							  	// 

                         }

					  // .then(response => {
						 //       if (!response.ok) {
						 //           throw new Error("HTTP error " + response.status);
						 //       }
						 //       return response.json();
						 //   })
						 // .then(json => {
						 //       this.users = json;
						 //       player.push(this.users)
						 //       for (i in player[0]){					       		
						 //       		view_players_wrapper = document.getElementById("view_players")
						 //       		console.log(player[0][i])
						 //       }
						 //   })
					// var xhr = new XMLHttpRequest();
					// var url = `${apiUrl}/overall`;
					// xhr.open("POST", url, true);
					// xhr.setRequestHeader("Content-Type", "application/json");
					// xhr.onreadystatechange = function () {
					// if (xhr.readyState === 4 && xhr.status === 200) {
					// 			var json = JSON.parse(xhr.responseText);
					// 			}
					// };
					// var data =JSON.stringify({
					// 	"Reactions"	:  res,
					// 	"Composure"	: comp,
					// 	"Vision"	: vis,
					// 	"ShortPassing"	:short,
					// 	"BallControl"	: balls
					// 	});
					// // console.log(data);
					// xhr.send(data);
			}


}, false);

// for login purpose

// making  post request 