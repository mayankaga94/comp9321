document.addEventListener('DOMContentLoaded', function(){ 
	var apiUrl = `http://0.0.0.0:3000`;
		document.getElementById("admin_p").addEventListener("click", myFunction);
		function myFunction(e){
				  document.getElementById('signup_form').style.display = "block";
				 document.getElementById('signup_form').style.display = "block";
		}
	document.getElementById("submiti").addEventListener("click", myFunction_1);
	function myFunction_1(e){
    var verify_username= document.getElementById("e").value;
    var verify_pass= document.getElementById("f").value;
  	 const user = {
        Username: `${verify_username}`,
        Password: `${verify_pass}`
    }
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"   
        },
        body: JSON.stringify(user)
    }
        fetch(`${apiUrl}/token`, options)
    .then(res => res.json())
     .then(json =>myfunc(json))
    function myfunc(jsons){
    	// alert(jsons.token)
    	localStorage.setItem('token',jsons.token)
    	 var tokenid=localStorage.getItem('token')
    	 alert("Permision Granted")
 			document.getElementById('admin_section').style.display = "block";

	document.getElementById("rm_player").addEventListener("click", remove);
 		  		 	function remove(e){
 		  		 		// alert("hi")
 		  		 		 zz = document.getElementById("a").value;
 		 		fetch(`${apiUrl}/player/${zz}`, {
					  method: 'DELETE',
					  headers: {'content-type': 'application/json'},
					  body: JSON.stringify(`${zz}`)
					})
					.then(res => res.text()) // OR res.json()
					.then(res => console.log(res))

}


				
}

// for adding a plater 

document.getElementById("close_btn").addEventListener("click", close_login)

function close_login(e){
document.getElementById('signup_form').style.display = "none";


// ---------for getting player flas and plot --------------------------

document.getElementById("adp_layer").addEventListener("click", add);

	function add(e){
			 xx = "Neel";
			 // fetch(`${apiUrl}/player/${xx}`, putMethod)
				// 	.then(response => response.json())
				// 	.then(data => console.log(data)) // Manipulate the data retrieved back, if we want to do something with it
				// 	.catch(err => console.log(err)) // Do something with the error
					const putMethod = {
					method: 'PUT', // Method itself
					headers: {
					'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
					},
					// body: JSON.stringify(`${Neel}`) // We send data in JSON format
					}
					fetch(`${apiUrl}/player/${xx}`, putMethod)
					.then(response => response.json())
					console.log(response)
					.then(data => console.log(data)) 
					.catch(err => console.log(err)) 
				}
    		}
		}
// ----------------------------------admin ends -----------------------------------------------------------




document.getElementById("country_find").addEventListener("click", country_team);

	function country_team(e){
		 country_name = document.getElementById("c").value;
		 alert(`${country_name}`)
			var player_team_ = [];
		          const options_new ={
				        method :'GET',
				        // body: JSON.stringify(country_name)
				    }
				     fetch(`${apiUrl}/team/${country_name}`,options_new)
					  .then(response => {
						       if (!response.ok) {
						           throw new Error("HTTP error " + response.status);
						       }
						       return response.json();
						   })
						 .then(json => {

						       this.users = json;
						      player_team_.push(this.users)

						       for (i in player_team_[0].Team){					       		
						       	var iDiv2 = document.createElement('div');
										abili2 = document.getElementById("get_countryplayer");
										iDiv2.append(player_team_[0].Team[i])
										abili2.append(iDiv2)
						       		// view_players_wrapper = document.getElementById("view_players")
						       		// console.log(player_team_[0].Team[i])
						       }
						   })
            		 e.preventDefault();    
		      }


// ----------------------------get tea contry --------------------------



document.getElementById("player_naem_ratinf").addEventListener("click", country);
	function country(e){
		var player_plots=[];
		 player_plot = document.getElementById("d").value;
			var player = [];
		          const options_new ={
				        method :'GET',
				        body: JSON.stringify()
				    }
				     fetch(`${apiUrl}/tags/${player_plot}`,options_new)
					  .then(response => {
						       if (!response.ok) {
						           throw new Error("HTTP error " + response.status);
						       }
						       return response.json();
						   })
						 .then(json => {
						       this.player = json;
						      player_plots.push(this.player)
						      player_plotx = document.getElementById("view_ab");
						     
						      // player_plotx.innerHTML =  "`${player_plot}` abilities are :";
						       for (i in player_plots[0].Tags ){					       		
						       		// view_players_wrapper = document.getElementById("view_players")
										var iDiv = document.createElement('div');
										abili = document.getElementById("abil");
										iDiv.id = 'abilities';
										// iDiv.className = 'block';

										iDiv.append(player_plots[0].Tags[i]);
										abili.append(iDiv);
						       		// console.log(player_plots[0].Tags[i])
						       }
						   })
            		 e.preventDefault();    
		      }		
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
// -------------for posting similar player request =------------------/

document.getElementById('fetch_players').onclick = closestfunction;
	function closestfunction(){
					// recomm_res = document.getElementById("recomm");
					// lisr
					var closest = [];
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
  							  	var div_1 = document.getElementById('view_players_rating');
  							  	div_1.innerHTML += jsons.Overall_Rating;
  							  	// implementation of getting closest player						
			  						fetch(`${apiUrl}/closest`,options_new)
							       .then(res_1 => res_1.json())
							       .then(jsonz =>myfunc(jsonz))
			  							  function myfunc(jsonz){

			  							  		// console.log(jsonz.Closest_Player);
			  							  		closest.push(jsonz.Closest_Player);
			  							  		console.log(closest[0]);
			  							  	for (j in closest[0] )
			  							  	{
			  							  		var recomm_res = document.getElementById('recomm');
					  							 var iDiv3 = document.createElement('div');
												iDiv3.id = 'similar';
												iDiv3.append(closest[0][j])

			  							  			recomm_res.append(iDiv3);
			  							  	}
			  							  	

			  				}
                         }
					}
}, false);

// for login purpose

// making  post request 