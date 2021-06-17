define([
    'jquery',
    'js/certificates/views/certificate_bulk_allowlist'
],
    function($, CertificateBulkAllowlistView) {
        'use strict';
        describe('certificate bulk exceptions generation', function() {
            var certificate_bulk_exception_url = 'test/url/';
            var SELECTORS = {
                upload_csv_button: '.upload-csv-button',
                bulk_allowlist_exception_form: 'form#bulk-allowlist-exception-form',
                bulk_exception_results: '.bulk-exception-results'
            };
            beforeEach(function() {
                setFixtures();
                var fixture = readFixtures(
                    'templates/instructor/instructor_dashboard_2/certificate-bulk-allowlist.underscore'
                );

                setFixtures(
                    "<script type='text/template' id='certificate-bulk-allowlist-tpl'>" + fixture + '</script>' +
                    "<div class='bulk-allowlist-exception'></div>"
                );

                this.view = new CertificateBulkAllowlistView({
                    bulk_exception_url: certificate_bulk_exception_url
                });
                this.view.render();
            });

            it('bind the ajax call and the result will be success', function() {
                var submitCallback;
                spyOn($, 'ajax').and.callFake(function(params) {
                    params.success({
                        row_errors: {},
                        general_errors: [],
                        success: ['user test in row# 1']
                    });
                    return {
                        always: function() {}
                    };
                });
                submitCallback = jasmine.createSpy().and.returnValue();
                this.view.$el.find(SELECTORS.bulk_allowlist_exception_form).submit(submitCallback);
                this.view.$el.find(SELECTORS.upload_csv_button).click();
                expect($(SELECTORS.bulk_exception_results).text()).toContain('1 learner is successfully added to the ' +
                    'exception list');
            });

            it('bind the ajax call and the result will be general error', function() {
                var submitCallback;
                spyOn($, 'ajax').and.callFake(function(params) {
                    params.success({
                        row_errors: {},
                        general_errors: ['File is not attached.'],
                        success: []
                    });
                    return {
                        always: function() {}
                    };
                });
                submitCallback = jasmine.createSpy().and.returnValue();
                this.view.$el.find(SELECTORS.bulk_allowlist_exception_form).submit(submitCallback);
                this.view.$el.find(SELECTORS.upload_csv_button).click();
                expect($(SELECTORS.bulk_exception_results).text()).toContain('File is not attached.');
            });

            it('bind the ajax call and the result will be singular form of row errors', function() {
                var submitCallback;
                spyOn($, 'ajax').and.callFake(function(params) {
                    params.success({
                        general_errors: [],
                        row_errors: {
                            data_format_error: ['user 1 in row# 1'],
                            user_not_exist: ['user 2 in row# 2'],
                            user_already_allowisted: ['user 3 in row# 3'],
                            user_not_enrolled: ['user 4 in row# 4'],
                            user_on_certificate_invalidation_list: ['user 5 in row# 5']
                        },
                        success: []
                    });
                    return {
                        always: function() {}
                    };
                });
                submitCallback = jasmine.createSpy().and.returnValue();
                this.view.$el.find(SELECTORS.bulk_allowlist_exception_form).submit(submitCallback);
                this.view.$el.find(SELECTORS.upload_csv_button).click();
                expect($(SELECTORS.bulk_exception_results).text()).toContain('1 record is not in correct format');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('1 learner does not exist in LMS');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('1 learner is already white listed');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('1 learner is not enrolled in course');
                expect($(SELECTORS.bulk_exception_results).text()).toContain(
                    '1 learner already appears on the certificate invalidation list'
                    );
            });

            it('bind the ajax call and the result will be plural form of row errors', function() {
                var submitCallback;
                spyOn($, 'ajax').and.callFake(function(params) {
                    params.success({
                        general_errors: [],
                        row_errors: {
                            data_format_error: ['user 1 in row# 1', 'user 1 in row# 1'],
                            user_not_exist: ['user 2 in row# 2', 'user 2 in row# 2'],
                            user_already_allowlisted: ['user 3 in row# 3', 'user 3 in row# 3'],
                            user_not_enrolled: ['user 4 in row# 4', 'user 4 in row# 4'],
                            user_on_certificate_invalidation_list: ['user 5 in row# 5', 'user 5 in row# 5']
                        },
                        success: []
                    });
                    return {
                        always: function() {}
                    };
                });
                submitCallback = jasmine.createSpy().and.returnValue();
                this.view.$el.find(SELECTORS.bulk_allowlist_exception_form).submit(submitCallback);
                this.view.$el.find(SELECTORS.upload_csv_button).click();
                expect($(SELECTORS.bulk_exception_results).text()).toContain('2 records are not in correct format');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('2 learners do not exist in LMS');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('2 learners are already white listed');
                expect($(SELECTORS.bulk_exception_results).text()).toContain('2 learners are not enrolled in course');
                expect($(SELECTORS.bulk_exception_results).text()).toContain(
                    '2 learners already appear on the certificate invalidation list'
                );
            });

            it('toggle message details', function() {
                var submitCallback;
                spyOn($, 'ajax').and.callFake(function(params) {
                    params.success({
                        row_errors: {},
                        general_errors: [],
                        success: ['user test in row# 1']
                    });
                    return {
                        always: function() {}
                    };
                });
                submitCallback = jasmine.createSpy().and.returnValue();
                this.view.$el.find(SELECTORS.bulk_allowlist_exception_form).submit(submitCallback);
                this.view.$el.find(SELECTORS.upload_csv_button).click();
                expect(this.view.$el.find('div.message > .successfully-added')).toBeHidden();
                this.view.$el.find('.arrow#successfully-added').trigger('click');
                expect(this.view.$el.find('div.message > .successfully-added')).toBeVisible();
            });
        });
    });
