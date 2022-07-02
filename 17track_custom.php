<?php
/*
    Plugin Name: 17Track - Custom plugin
    Plugin URI: https://www.upwork.com/freelancers/~0192cdf6c40b5e060a
    Description: 17Track - Custom plugin
    Author: Marinko
    Author URI: https://www.upwork.com/freelancers/~0192cdf6c40b5e060a
    Text Domain: 17track
    Domain Path: /languages
    Version: 1.0.0
*/

//Automatic shipping info to 17track
add_action('woocommerce_order_status_completed', 'track_custom', 100);
function track_custom($order_id)
{
    $custom_tracking = new _17TRACK();
    $date = new DateTime();
    $date = $date->format('Y-m-d\TH:i:s\Z');
    $order = wc_get_order($order_id);
    $items_count = count($order->get_items());
    $data = array();
    $data['yqtrack_tracking_provider'] = '190271';
    $data['yqtrack_tracking_provider_name'] = 'Aliexpress Shipping';
    $data['yqtrack_tracking_shipdate'] = $date;

    for ($i=1; $i<=$items_count; $i++) {
        $package_name = "Package #".$i;

        $notes = wc_get_order_notes([
        'order_id' => $order->get_id(),
     ]);
        foreach ($notes as $note) {
            if (str_contains($note->content, 'Tracking number')) {
                $text = substr($note->content, (strpos($note->content, "Tracking number: ")+17));
                $end = explode("(", $text);
                $shipping_nr = $end[0];
            }
        }
        if ($shipping_nr != '') {
            //Tracking provider hardcoded to Aliexpress shipping per request
            $data['yqtrack_tracking_number'] = $shipping_nr;
            $custom_tracking->save_meta_box($order_id, $data);
            $order = wc_get_order($order_id);
            // The text for the note
            $note = __("Added shipping number to 17 track: ".$shipping_nr);
            // Add the note
            $order->add_order_note($note);
        }
    }
}

add_action('wp_footer', 'custom_track_script');

//Get postal code script
function custom_track_script()
{
    if (is_checkout()) {
        wp_enqueue_script('17track_custom_script', plugins_url('/17track_custom.js', __FILE__), '', '1.2');
    }
    if (is_product()) {
        wp_enqueue_script('disable_buynow', plugins_url('/disable_buynow.js', __FILE__), '', '1.2');
    }
}

//RUT Saving
// Display "Verification ID" on Admin order edit page
add_action('woocommerce_admin_order_data_after_billing_address', 'display_rut_in_admin_order_meta', 10, 1);
function display_rut_in_admin_order_meta($order)
{
    // compatibility with WC +3
    $order_id = method_exists($order, 'get_id') ? $order->get_id() : $order->id;
    echo '<p><strong>'.__('RUT number', 'woocommerce').':</strong> ' . get_post_meta($order_id, 'rut_number', true) . '</p>';
}

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool
    {
        return '' === $needle || false !== strpos($haystack, $needle);
    }
}
