(function () {
    let error_page =  `<a href="../404.html></a>`.trim();

    //let postId = $("#post_title").attr("meta-postId");


    $("#new_post_form").on('submit', function(e) {
        e.preventDefault();
        let formData = $(this).serializeArray();
        console.log("!!!!THIS IS POSTS FORMDATA",formData);

        let data = {};
        for (let i = 0; i < formData.length; i++) {
            data[formData[i].name] = formData[i].value;
        }
        console.log("!!!!THIS IS POSTS DATA", data);
        $.ajax({
            type: "POST",
            url: "/api/posts/new",
            contentType: "application/json",
            data: JSON.stringify(data),
            // beforeSend: function (xhr) {   //Include the bearer token in header
            //     xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
            // },
            success: function(data) {
                // console.log("####THIS IS THE POSTS DATA", data);
                // let html = '';
                // data.forEach(post => {
                // html += post_html
                // .replace(/{{Title}}/g, post.title)
                // .replace(/{{Auther}}/g, post.userId)
                // .replace(/{{Content}}/g, post.content)
                // .replace(/{{Date}}/g, post.date)
                // .replace(/{{ID}}/g, post.ID); //g means global
                // });
                // console.log("console log of html:",html);
                // $("#post_container").html(html);
                },
            error: function(data) {
                alert("ERROR: " + data); //error page?
                $("errorPage").html(error_page);
            }
        })
    });

    

})();