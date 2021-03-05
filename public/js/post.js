(function () {
    let votes_html = `<small class="text-muted">{{Vcount}}</small>`.trim();

    let comment_html = `<div class ="card">
    <div class="card-body">
    <p class="card-content">{{content}}</p>
    </div>
        <h6 class="card-footer text-muted align-middle" id="comment_title" meta_commentId="{{ID}}">Posted by {{Saguid}} {{date}}
        <div class="btn-toolbar float-right">
            <button type="button" id="like_button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#edit_post_modal"><i class="far fa-heart"></i></button>
        </div>
        </h6>

        </div>`.trim();

    let ifCurrUser_html = `<button type="button" id="edit_post_button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#edit_post_modal"><i class="far fa-edit"></i>
    </button>
    <button type="button" id="delete_comment_button" class="btn btn-outline-secondary"><i class="far fa-trash-alt"></i>
        </button>`.trim();

    let optional_toolbar = `<button type="button" id="like_button" class="btn btn-outline-secondary" data-toggle="modal" data-target="#edit_post_modal"><i class="far fa-heart"></i></button>`.trim();
        
    // (window.currSession && window.currSession.id == Saguid) 


    let error_page =  `<a href="../../views/pages/401.ejs></a>`.trim();

    let postId = $("#post_title").attr("meta-postId");  //"prop" gets or sets the value of property
    console.log("THIS IS THE POST ID", postId);


    //let _id = window.id;
    console.log('@@@@@@currSession = ', id);
    
    $.ajax({
        type: "GET",
        url: '/api/posts/' + postId + "/votes",
        success: function(data) {
            // console.log('from post.js: THIS IS THE VOTES COUNT: ', data[0].count);
            let Vcount = String(data[0].count);
            // console.log('from post.js: THIS IS THE VOTES COUNT: ', Vcount);
            let vhtml = '';
            
            vhtml += votes_html.replace(/{{Vcount}}/g, Vcount);
            // console.log("vhtml: ", vhtml);

            $("#votes_container").html(vhtml);
        },
        error: function(data) {
            alert("VOTES GET ERROR: " + data);
            $("errorPage").html(error_page);
        }
    });

    
    function getSuccess(data) {
        // console.log("THIS IS THE POST DATA",data);
        if(typeof(data) === "string"){data = JSON.parse(data)}
        console.log("##### from post.js; data is ", data);
        let html = '';
        data.forEach(comment => {
            console.log("data's user id is ", comment.Saguid);
            let author = comment.Saguid;

            if(author === id) {
                console.log("Comment author ", author, " is equal to the currUser ", id);
                console.log("original one = ", comment_html);
                comment_html = comment_html.replace(optional_toolbar, ifCurrUser_html);
                console.log("replaced one = ", comment_html);
                html += comment_html
                .replace(/{{Saguid}}/g, comment.Saguid)
                .replace(/{{content}}/g, comment.content)
                .replace(/{{date}}/g, moment(comment.date).fromNow())
                .replace(/{{ID}}/g, comment.commentID); //g means global
                console.log("if author", author, "= id ", id ," then resulting html is ", html);
                console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            } else{
                console.log("Comment author ", author, " is NOT equal to the currUser ", id);
                html += comment_html
                .replace(/{{Saguid}}/g, comment.Saguid)
                .replace(/{{content}}/g, comment.content)
                .replace(/{{date}}/g, moment(comment.date).fromNow())
                .replace(/{{ID}}/g, comment.commentID); //g means global
                console.log("if author", author, "= id ", id ," then resulting html is ", html);
            //     console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            }

            // html += comment_html
            // .replace(/{{Saguid}}/g, comment.Saguid)
            // .replace(/{{content}}/g, comment.content)
            // .replace(/{{date}}/g, moment(comment.date).fromNow())
            // .replace(/{{ID}}/g, comment.commentID); //g means global

            // if(author === id) {
            //     console.log("Comment author ", author, " is equal to the currUser ", id);
            //     html = html.replace(optional_toolbar, ifCurrUser_html);
            //     console.log("if author", author, "= id ", id ," then resulting html is ", html);
            //     console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            // }
            // else {
            //     console.log("Comment author ", author, " is NOT equal to the currUser ", id);
            //     console.log("if author", author, "= id ", id ," then resulting html is ", html);
            //     console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            

        });

        // console.log("$$$ html: ", html);
        $("#comment_container").html(html);
        
        //console.log("comment data is===== ", html);

        
    }

    function getError(data) {
        alert("COMMENT GET ERROR: " + data);
        $("errorPage").html(error_page);
    }
    $.ajax({
        type: "GET",
        url: "/api/posts/" + postId + "/comments",
        success: getSuccess,
        error: getError
    });

    

    $("#new_comment_form").on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        //console.log("THIS IS COMMENT FORM DATA",formData);
        let data = {};
        for (let i = 0; i < formData.length; i++) {
            data[formData[i].name] = formData[i].value;
        }
        // console.log("THIS IS THE COMMENT DATA", data);
        $.ajax({
            type: "POST",
            url: "/api/posts/" + postId,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data) {
                console.log("THIS IS THE COMMENT DATA", data);
                window.location.reload(true);
            },
            error: function(data) {
                // alert("COMMENT POSTING ERROR: " + data); //error page?
                // $("errorPage").html(error_page);
                //window.location.replace("/401");
            }
        });
        
    });
    $(function() {
        $("#edit_post_button").on('click', function() {
        })
        $("#edit_post_form").on('submit', function(e) {
            e.preventDefault();
            let formData = $(this).serializeArray();
            //console.log("THIS IS COMMENT FORM DATA",formData);
            let data = {};
            for (let i = 0; i < formData.length; i++) {
                data[formData[i].name] = formData[i].value;
            }
            console.log("THIS IS THE EDITED DATA", data);
            $.ajax({
                type: "PUT",
                url: "/api/posts/" + postId,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function() {
                    //console.log("THIS IS THE COMMENT DATA", data);
                    window.location.reload();
                },
                error: function() {
                    console.log("error = ", error);
                    //window.location.replace("/401");
                }
            });
        });
    });
    $(function() {
        $("#delete_post_button").on('click', function(e) {
            e.preventDefault();
            if(confirm("Are you sure you want to permanently delete this post?")) {
                console.log("DELETING POST ********$$$$$$");
                $.ajax({
                    type:"DELETE",
                    url: "/api/posts/" + postId,
                    success: function() {
                        window.location.replace("/posts");
                    },
                    error: function() {
                        console.log("ERROR WHILE DELETING POST= ", error);
                    }
                });
            }
        });
    });

    $(document).on('click', "#delete_comment_button", function(e) {
        e.preventDefault();
        console.log('DELETE COMMENT BUTTON HAS BEEN PRESSED!');
    })

    
    $(document).on('click', "#delete_comment_button", function(e) {
        let commentID = $('#comment_title').attr("meta_commentId");
            e.preventDefault();
            if(confirm("Delete comment?")) {
                console.log("DELETING COMMENT ********$$$$$$");
                $.ajax({
                    type:"DELETE",
                    url: "/api/posts/" + postId + "/comments/" + commentID,
                    success: function() {
                        window.location.reload();
                    },
                    error: function() {
                        console.log("ERROR WHILE DELETING POST= ", error);
                    }
                });
            }
    });

    $(document).on('click', "#upvote", function(e) {
            e.preventDefault();
            // console.log("check if postID is fetched properly: ", postId);
            // console.log("SOMEONE JUST UPVOTED####");
            $.ajax({
            type:"POST",
            url: "/api/posts/" + postId + "/votes",
            success: function(data) {
              window.location.reload();
            },
            error: function(data) {
              window.location.replace("/401");
            }
            
          })
      });
    

    

})();