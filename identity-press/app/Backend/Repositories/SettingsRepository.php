<?php //phpcs:ignore WordPress.Files.FileName.NotHyphenatedLowercase
namespace App\Backend\Repositories;

defined( 'ABSPATH' ) || exit;

/**
 * Repository for managing plugin settings in the WordPress options table.
 *
 * @since      1.0.0
 * @package    IdentityPress
 * @subpackage App\Backend\Repositories
 */
class SettingsRepository {
	/**
	 * The option name for plugin settings.
	 */
	private const OPTION_NAME = 'identity_press_settings';

	/**
	 * Get all settings.
	 *
	 * @return array
	 */
	public function get_all(): array {
		$defaults = array(
			'general'  => array(
				'login_method'      => 'phone',
				'otp_length'        => '5',
				'wc_replace_login'  => false,
				'wc_lock_checkout'  => false,
				'develop_mode'      => false,
			),
			'gateways' => array(),
			'style'    => array(
				'primary_color'   => '#4f46e5',
				'secondary_color' => '#f8fafc',
				'logo_url'        => '',
				'custom_css'      => '',
			),
		);

		$settings = get_option( self::OPTION_NAME, $defaults );

		return wp_parse_args( $settings, $defaults );
	}

	/**
	 * Update a specific setting group.
	 *
	 * @param string $group The settings group (general, style, gateways).
	 * @param array  $data  The new settings data.
	 * @return bool
	 */
	public function update_group( string $group, array $data ): bool {
		$settings           = $this->get_all();
		$settings[ $group ] = wp_parse_args( $data, $settings[ $group ] ?? array() );

		// update_option returns false if the value is the same as current.
		// We should return true if update_option returns true OR if the option exists.
		$updated = update_option( self::OPTION_NAME, $settings );
		
		return $updated || get_option( self::OPTION_NAME ) === $settings;
	}

	/**
	 * Add a new gateway.
	 *
	 * @param array $gateway
	 * @return bool
	 */
	public function add_gateway( array $gateway ): bool {
		$settings = $this->get_all();
		$gateway['id'] = uniqid('gw_');
		$settings['gateways'][] = $gateway;

		return update_option( self::OPTION_NAME, $settings );
	}
}
