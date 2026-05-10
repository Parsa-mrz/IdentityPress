<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Controllers;

use App\Backend\Repositories\SettingsRepository;

defined( 'ABSPATH' ) || exit;

/**
 * Controller for handling authentication form shortcodes.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Controllers
 */
class AuthFormController {
	/**
	 * The settings repository instance.
	 *
	 * @var \App\Backend\Repositories\SettingsRepository
	 */
	private $repository;

	/**
	 * Initialize the class and register shortcode hooks.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->repository = new SettingsRepository();
		add_shortcode( 'identity_press_auth', array( $this, 'render_auth_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
	}

	/**
	 * Enqueue necessary scripts and styles for the frontend.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue_frontend_assets() {
		global $post;

		$settings   = $this->repository->get_all();
		$wc_replace = ! empty( $settings['general']['wc_replace_login'] );

		$should_load = false;

		if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'identity_press_auth' ) ) {
			$should_load = true;
		}

		if ( class_exists( 'WooCommerce' ) && is_account_page() && $wc_replace && ! is_user_logged_in() ) {
			$should_load = true;
		}

		if ( ! $should_load ) {
			return;
		}

		$asset_file = include IDENTITY_PRESS_PLUGIN_DIR . '/app/Frontend/Build/index.asset.php';

		wp_enqueue_style(
			'identity-press-frontend',
			IDENTITY_PRESS_PLUGIN_URL . '/app/Frontend/Build/index.css',
			array(),
			$asset_file['version']
		);

		wp_enqueue_script(
			'identity-press-frontend',
			IDENTITY_PRESS_PLUGIN_URL . '/app/Frontend/Build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			array( 'in_footer' => true )
		);

		wp_localize_script(
			'identity-press-frontend',
			'identityPressAdmin',
			array(
				'ajax_url'     => admin_url( 'admin-ajax.php' ),
				'nonce'        => wp_create_nonce( 'wp_rest' ),
				'root'         => esc_url_raw( rest_url() ),
				'version'      => IDENTITY_PRESS_VERSION,
				'is_wc_active' => class_exists( 'WooCommerce' ),
			)
		);
	}

	/**
	 * Render the authentication form shortcode.
	 *
	 * @since 1.0.0
	 * @return string The shortcode output.
	 */
	public function render_auth_shortcode() {
		return '<div class="identity-press-auth-root"></div>';
	}
}
