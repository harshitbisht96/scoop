


Posts = new Mongo.Collection('posts');
Comments = new Mongo.Collection('comments');
Likes= new Mongo.Collection('likes');
AnswerLikes=new Mongo.Collection('answerlikes');
Profile=new Mongo.Collection('profile');
Follower=new Mongo.Collection('follower');






if(Meteor.isClient){
   
	Meteor.subscribe('posts');
    Meteor.subscribe('comments');
    Meteor.subscribe('likes');
    Meteor.subscribe('profile');
    Meteor.subscribe('follower');
    Meteor.subscribe('answerlikes');

    
    
    

    Template.users.helpers({
        'profile':function(){
            return Profile.find({}, {sort: {createdAt: -1}});
        }

    });

     Template.commentPage.helpers({
        'userImage':function(){
            var img=Profile.findOne({currentUser:this.postedById}).src;
            return img;
        }
    });

    Template.following.helpers({
        'list':function(){
            var list=[];
            for(x=0;x<this.following;x++)
            {
                var a= (Profile.findOne({currentUser:this.followingTo[x]}));
                 list[x]=a;

            }
            
            return list;

        }
    });
     Template.followers.helpers({
        'list':function(){
            var list=[];
            for(x=0;x<this.followers;x++)
            {
                var a= (Profile.findOne({currentUser:this.followedBy[x]}));
                 list[x]=a;

            }
            
            return list;

        }
    });


    
	Template.posts.helpers({
    'post': function(){
        return Posts.find();
    }
});
    Template.postItem.helpers({
        'userImage':function(){
            var img=Profile.findOne({currentUser:this.postedById}).src;
            return img;
        },
        'formattedDate':function(){
            return moment(this.createdAt).format('ddd, h:mm:ss');
        }
    });

    Template.navigation.helpers({
        'userId':function(){
            var a='/user/'+ Profile.findOne({currentUser:Meteor.userId()})._id ;
            return a;
        },

        'disabled':function(){
            var a=document.getElementById('searchbox').value;
            if (a=='')
            {
                return 'disabled';
            }
        }
    });


    Template.postItem.helpers({
        'isUser':function(){
            return this.postedBy==Meteor.user().username;

        },


        'likes':function(){

            return this.likes;
        },
    'commentsNo':function(){
        return this.comments;   
            
        },
    'likeColor':function(){
        var documentId = this._id;
            var currentUser=Meteor.userId().username;
            var clickCombination=documentId+' '+Meteor.userId();
            
            if (Likes.findOne({combination:clickCombination})!= undefined)
            {

            return 'likeColor';
    }    
    

    }
});
    Template.profilePage.helpers({
        'disabled':function(){
            if (Meteor.userId()==this.currentUser){
                return 'disabled';
            }
        },
        'followColor':function(){
            var meteorUser=Meteor.userId();
            var profileUser=this.currentUser;
            var clickCombination=meteorUser+' '+profileUser;
            if (Follower.findOne({combination:clickCombination})!=undefined)
            {

                return 'followColor';

            }
        },
        'followOrfollowing':function(){
            var meteorUser=Meteor.userId();
            var profileUser=this.currentUser;
            var clickCombination=meteorUser+' '+profileUser;
            if (Follower.findOne({combination:clickCombination})!=undefined)
                {return 'Following';}
            else{
                return 'Follow';
            }
        }
    });


    Template.comments.helpers({
    'comment': function(){
        
        var currentId=this._id;
        return Comments.find({postId:this._id});
    
    }  
    }); 
    
    
   

     

    

    Template.commentName.helpers({
        'userImage':function(){
            var a=Profile.findOne({currentUser:this.madeById}).src;
            return a;
        },
        'likes':function(){

            return this.likes;
        },
        'likeAnswerColor':function(){
        var documentId = this._id;
            var currentUser=Meteor.userId().username;
            var clickCombination=documentId+' '+Meteor.userId();
            
            if (AnswerLikes.findOne({combination:clickCombination})!= undefined)
            {

            return 'likeAnswerColor';
    }    
    

    }
    })



	Template.addPost.events({
		'click button':function(event){
			event.preventDefault();
            var postedBy = Meteor.user().username;
			var postName = document.getElementById('myinput').value;
			
            
		    Posts.insert({
				name:postName,
				createdAt:new Date(),
				postedById:Meteor.userId(),
                postedBy:postedBy,
                likes:0,
                comments:0

			});
			document.getElementById('myinput').value='';
		},
        'mouseover #myinput':function(event){
            event.preventDefault();
            var containerElement = document.getElementsByTagName("p");
            Array.from(containerElement).map(function(elem){ elem.setAttribute('class', 'blur'); });
            console.log(containerElement);
        },
        'mouseout #myinput':function(event){
            event.preventDefault();
            var containerElement = document.getElementsByTagName('p');

            Array.from(containerElement).map(function(elem){ elem.setAttribute('class', null); });
        }

	   });

	Template.postItem.events({
		'click #delete-post': function(event){
    event.preventDefault();
    var documentId = this._id;
    
    var confirm = window.confirm("Delete this post?");
    if(confirm){
        Posts.remove({ _id: documentId });
    }
		},

        'click button':function(event){
            event.preventDefault();
            var documentId = this._id;
            var currentUser=Meteor.userId();
            var clickCombination=documentId+' '+Meteor.userId();
            
            if (Likes.findOne({combination:clickCombination})== undefined)
            {

            Likes.insert({
                combination:clickCombination
            });

            this.likes=this.likes+1;
            
            Posts.update({ _id: documentId },{$set:{likes:this.likes}});
        } else {
            var a=Likes.findOne({combination:clickCombination});
            var b=a._id;
            Likes.remove({
                _id:b
            });

        
        this.likes=this.likes-1;
            
            Posts.update({ _id: documentId },{$set:{likes:this.likes}});

        
        }
    }


	});


	Template.navigation.events({
    'click #logout': function(event){
        event.preventDefault();

        var confirm = window.confirm("Do you want to logout?");
        if (confirm)
        {
         
        Meteor.logout();
        Router.go('login');
        }

    }
});
    Template.addComment.events({
        'click button':function(event){
        event.preventDefault();

        var comment=document.getElementById('mycomment').value;
        var madeBy=Meteor.user().username;
        var currentId=this._id;
        Comments.insert({
            comment:comment,
            madeOn:new Date(),
            madeBy:madeBy,
            postId:currentId,
            madeById:Meteor.userId(),
            likes:0,


        });
        document.getElementById('mycomment').value='';
        this.comments=this.comments+1;
        Posts.update({ _id: currentId },{$set:{comments:this.comments}});

        }

    });


      Template.createProfile.events({
        'submit form':function(event){
        event.preventDefault();
        var name=document.getElementById('name').value;
        var hobbies=document.getElementById('hobbies').value;
        var description=document.getElementById('description').value;
        var src=document.getElementById('src').value;
        var currentUser=Meteor.userId();
        Profile.update({ _id: this._id },{$set:{name:name}});
        Profile.update({ _id: this._id },{$set:{hobbies:hobbies}});
        Profile.update({ _id: this._id },{$set:{description:description}});
        Profile.update({ _id: this._id },{$set:{src:src}});
        Router.go('posts');
        
    }
});


    Template.commentName.events({
        'click button':function(event){
            event.preventDefault();
            var documentId = this._id;
            var currentUser=Meteor.userId();
            var clickCombination=documentId+' '+Meteor.userId();
            
            if (AnswerLikes.findOne({combination:clickCombination})== undefined)
            {

            AnswerLikes.insert({
                combination:clickCombination
            });

            this.likes=this.likes+1;
            
            Comments.update({ _id: documentId },{$set:{likes:this.likes}});
        } else {
            var a=AnswerLikes.findOne({combination:clickCombination});
            var b=a._id;
            AnswerLikes.remove({
                _id:b
            });

        
        this.likes=this.likes-1;
            
            Comments.update({ _id: documentId },{$set:{likes:this.likes}});

        
        }
    }

    });
    
    Template.profilePage.events({
        'click button':function(event){
            event.preventDefault();
            var currentUser=Meteor.userId();//MeteorId of currentUser
            var profileUser=this.currentUser; //MeteorId of profileUser
            var clickCombination=currentUser+' '+profileUser;
            
            if (Follower.findOne({combination:clickCombination})== undefined)
            {

            Follower.insert({
                combination:clickCombination
            });


            this.followers=this.followers+1;

            
            var following=Profile.findOne({currentUser:Meteor.userId()});
            following.following=following.following+1;
            Profile.update({ _id: this._id },{$set:{followers:this.followers}});
            Profile.update({ _id: following._id },{$set:{following:following.following}});
            Profile.update({ _id: this._id },{$addToSet:{followedBy:Meteor.userId()}});
            Profile.update({ _id: following._id },{$addToSet:{followingTo:profileUser}});
        }

    }
});


Template.login.events({
    'submit form':function(event){
        event.preventDefault();
        var username = document.getElementById('usernameL').value;
var password =document.getElementById('passwordL').value;
Meteor.loginWithPassword(username, password, function(error){
    if(error){
        alert(error.reason);
    } else {
        
            Router.go("posts");
        
    }
});



    }
});

Template.registerTemplate.events({
    'submit form':function(event){
        event.preventDefault();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
     
 if ( username.length<7 || username.length>12)
 {
document.getElementById('demo1').innerHTML='Username must contain 7 to 12 characters.';
return false;
}
// if (unicode==32){
//     document.getElementById('demo1').innerHTML='Username must not contain spacebars.';
// }
if (password.length<7)
{
 document.getElementById('demo2').innerHTML='Password must contain 7 to 12 characters.';  
 return false 
}

        Accounts.createUser({

   username: username,
    password: password

}, function(error){
    if(error){
        alert(error.reason);
        document.getElementById('username').value='';
        document.getElementById('password').value=''; // Output error if registration fails
    } else {
        Profile.insert({
        name:'',
        hobbies:'',
        description:'',
        currentUser:Meteor.userId(),
        src:'',
        followers:0,
        following:0,
        followedBy:[],
        followingTo:[]
        });

        
     Router.go("createProfile"); // Redirect user if registration succeeds
    }

    });
    }

});

    

   

    Template.navigation.events({
    'submit form':function(event){
        event.preventDefault();
        var searchbox=document.getElementById('searchbox').value;
        if (searchbox=='')
        {
            Router.go('blank');
        }
        else
        {
        
        Router.go('/posts/search/'+searchbox);
    }

        
    }
    });



   





    
}

if(Meteor.isServer){
	Meteor.publish('posts', function(){
    return Posts.find();

});
    Meteor.publish('comments', function(){
    
    return Comments.find();
});
    Meteor.publish('likes', function(){
    
    return Likes.find();
});
    

    Meteor.publish('profile', function(){
    
    return Profile.find();
});

     Meteor.publish('follower', function(){
    
    return Follower.find();
});
     Meteor.publish('answerlikes', function(){
    
    return AnswerLikes.find();
});
   
     

}


