<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Controllers;

defined( 'ABSPATH' ) || exit;

/**
 * The core functionality of the plugin.
 *
 * @link       https://parsamirzaie.com
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Controllers
 */
class AssetsController {
	/**
	 * Initialize the class and register asset hooks.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
	}

	/**
	 * Enqueue admin styles for the plugin page.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page hook.
	 * @return void
	 */
	public function enqueue_admin_styles( $hook ) {
		if ( 'toplevel_page_identity-press' !== $hook ) {
			return;
		}

		$asset_file = include IDENTITY_PRESS_PLUGIN_DIR . '/app/Frontend/Build/index.asset.php';

		wp_enqueue_style(
			'identity-press-admin-panel',
			IDENTITY_PRESS_PLUGIN_URL . '/app/Frontend/Build/index.css',
			array(),
			$asset_file['version'],
			'all'
		);
	}

	/**
	 * Enqueue admin scripts and localize data for the plugin page.
	 *
	 * @since 1.0.0
	 * @param string $hook The current admin page hook.
	 * @return void
	 */
	public function enqueue_admin_scripts( $hook ) {
		if ( 'toplevel_page_identity-press' !== $hook ) {
			return;
		}

		$asset_file = include IDENTITY_PRESS_PLUGIN_DIR . '/app/Frontend/Build/index.asset.php';

		wp_enqueue_media();

		wp_enqueue_script(
			'identity-press-admin-panel',
			IDENTITY_PRESS_PLUGIN_URL . '/app/Frontend/Build/index.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			array(
				'in_footer' => true,
			)
		);

		wp_localize_script(
			'identity-press-admin-panel',
			'identityPressAdmin',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'root'     => esc_url_raw( rest_url() ),
				'version'  => IDENTITY_PRESS_VERSION,
				'is_wc_active' => class_exists( 'WooCommerce' ),
			)
		);

			wp_set_script_translations(
				'identity-press-admin-panel',
				'identity-press',
				IDENTITY_PRESS_PLUGIN_DIR . '/languages'
			);
	}
}
