<?php
/**
 * WooCommerce Login Template Override
 *
 * This template replaces the default WooCommerce login/register form
 * with the IdentityPress high-fidelity authentication form.
 *
 * @package IdentityPress
 */

defined( 'ABSPATH' ) || exit;

?>
<div class="identity-press-wc-login-wrapper">
	<?php echo do_shortcode( '[identity_press_auth]' ); ?>
</div>

<style>
	/* Hide WooCommerce's default headings and layout when our form is active */
	.woocommerce-account .woocommerce-MyAccount-content,
	.woocommerce-account .woocommerce-customer-login {
		background: transparent !important;
		border: none !important;
		box-shadow: none !important;
	}
	
	.woocommerce-account .u-columns.col2-set {
		display: none !important;
	}
</style>
