<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Controllers;

use App\Backend\Repositories\SettingsRepository;

defined( 'ABSPATH' ) || exit;

/**
 * Controller for managing WooCommerce integration logic.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Controllers
 */
class WooCommerceController {
	/**
	 * The settings repository instance.
	 *
	 * @var SettingsRepository
	 */
	private $repository;

	/**
	 * Initialize the class and register WooCommerce hooks.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return;
		}

		$this->repository = new SettingsRepository();
		$this->init_hooks();
	}

	/**
	 * Register WooCommerce specific hooks.
	 *
	 * @return void
	 */
	private function init_hooks() {
		$settings = $this->repository->get_all();
		$general  = $settings['general'] ?? array();

		if ( ! empty( $general['wc_replace_login'] ) ) {
			add_filter( 'wc_get_template', array( $this, 'replace_login_template' ), 10, 2 );
		}

		if ( ! empty( $general['wc_lock_checkout'] ) ) {
			add_action( 'template_redirect', array( $this, 'lock_checkout_flow' ) );
		}
	}

	/**
	 * Replace the default WooCommerce login template with our custom form.
	 *
	 * @param string $template      The template path.
	 * @param string $template_name The template name.
	 * @return string
	 */
	public function replace_login_template( $template, $template_name ) {
		if ( 'myaccount/form-login.php' === $template_name ) {
			// We can return a custom template or just render the shortcode
			// For simplicity and to maintain React functionality, we return a blank template
			// that just contains our root element or shortcode.
			return IDENTITY_PRESS_PLUGIN_DIR . '/app/Backend/Templates/woocommerce-login.php';
		}

		return $template;
	}

	/**
	 * Redirect unauthenticated users away from checkout if locked.
	 *
	 * @return void
	 */
	public function lock_checkout_flow() {
		if ( is_checkout() && ! is_user_logged_in() && ! is_wc_endpoint_url( 'order-pay' ) ) {
			wp_safe_redirect( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ) );
			exit;
		}
	}
}
