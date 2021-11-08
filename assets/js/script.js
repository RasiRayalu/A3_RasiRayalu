// function to call on form submit
$("#store").submit(function (event) {
    event.preventDefault();
    console.log('form submission jquery')
    // Making form data into json
    var formData = {
        cosmonautCount: $("#cosmonaut").val() || 0,
        milkshakeCount: $("#milkshake").val() || 0,
        name: $("#name").val(),
        address: $("#address").val(),
        province: $("#province").val(),
        city: $('#city').val(),
        phone: $("#phone").val(),
        email: $("#email").val()
    };

    $('#error').text("");
    // Ajax call to call the node endpoint
    $.ajax({
        type: "POST", // post request
        url: "/submit", // submit endpoint
        data: formData, // Formdata
        dataType: "json",
        encode: true,
    }).done(function (data) { // response
        console.log(data);
        // Error handling
        if(data.error) {
            $('#receipt').removeClass('d-block') // hiding the receipt
            $('#receipt_error').addClass('d-block') // Showing the error
            $('#error').text(data.error);
        } else {
            $('#receipt_error').removeClass('d-block') // Hiding the error block
            $('#receipt').addClass('d-block') // Showing the receipt block
            // If cosmonaut is present, adding it to the receipt
            if(data.cosmonaut) {
                $('#cosmonaut_tr').removeClass('d-none')
                $('#cosmonaut_qty').text(`x ${data.cosmonautCount}`)
                $('#cosmonaut_price').text(`$${data.cosmonaut}`)
            } else {
                $('cosmonaut_tr').addClass('d-none')
            }
            // If milkshake is present, adding it to the receipt
            if(data.milkshake) {
                $('#milkshake_tr').removeClass('d-none')
                $('#milkshake_qty').text(`x ${data.milkshakeCount}`)
                $('#milkshake_price').text(`$${data.milkshake}`)
            } else {
                $('#milkshake_tr').addClass('d-none')
            }
            // Adding remaining values to the receipt
            $('#receipt_name').text(data.name)
            $('#receipt_address').text(data.address)
            $('#receipt_city').text(data.city)
            $('#receipt_province').text(data.province)
            $('#receipt_phone').text(data.phone)
            $('#receipt_email').text(data.email)
            $('#receipt_tax').text(`$${data.tax}`)
            $('#receipt_total').text(`$${data.total}`)
        }
    });
});